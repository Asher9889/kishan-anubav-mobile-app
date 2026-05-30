import type { ReactNode } from 'react';
import { memo, useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { PencilLine, Share2 } from 'lucide-react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

import { Colors, Radius, Spacing, Typography } from '@/constants/theme';

type AppTheme = typeof Colors.light;

type ProfileActionsProps = {
  theme: AppTheme;
  onEditProfile: () => void;
  onShareProfile: () => void;
};

type ActionButtonProps = {
  theme: AppTheme;
  label: string;
  icon: ReactNode;
  variant: 'primary' | 'secondary';
  onPress: () => void;
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const ActionButton = ({ theme, label, icon, variant, onPress }: ActionButtonProps) => {
  const styles = useMemo(() => createStyles(theme), [theme]);
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const onPressIn = () => {
    scale.value = withSpring(0.97, { damping: 15, stiffness: 220 });
  };

  const onPressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 220 });
  };

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      style={[
        styles.buttonBase,
        variant === 'primary' ? styles.primaryButton : styles.secondaryButton,
        animatedStyle,
      ]}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      {icon}
      <Text style={[styles.buttonText, variant === 'primary' ? styles.primaryText : styles.secondaryText]}>
        {label}
      </Text>
    </AnimatedPressable>
  );
};

const ProfileActionsComponent = ({ theme, onEditProfile, onShareProfile }: ProfileActionsProps) => {
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <View style={styles.container}>
      <ActionButton
        theme={theme}
        label="Edit Profile"
        variant="primary"
        onPress={onEditProfile}
        icon={<PencilLine size={16} color={theme.text} strokeWidth={2.2} />}
      />
      <ActionButton
        theme={theme}
        label="Share Profile"
        variant="secondary"
        onPress={onShareProfile}
        icon={<Share2 size={16} color={theme.text} strokeWidth={2.2} />}
      />
    </View>
  );
};

export const ProfileActions = memo(ProfileActionsComponent);

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      gap: Spacing.sm,
    },
    buttonBase: {
      flex: 1,
      minHeight: 42,
      borderRadius: Radius.full,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      borderWidth: StyleSheet.hairlineWidth,
      paddingHorizontal: Spacing.md,
    },
    primaryButton: {
      backgroundColor: 'transparent',
      borderColor: theme.text,
    },
    secondaryButton: {
      backgroundColor: 'transparent',
      borderColor: theme.borderLight,
    },
    buttonText: {
      fontSize: Typography.bodyMedium.fontSize,
      lineHeight: Typography.bodyMedium.lineHeight,
      fontWeight: '800',
    },
    primaryText: {
      color: theme.text,
    },
    secondaryText: {
      color: theme.text,
    },
  });
