import { memo, useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import Animated, { useSharedValue, withSpring } from 'react-native-reanimated';

import { Colors, Radius, Spacing, Typography } from '@/constants/theme';

type AppTheme = typeof Colors.light;

type ProfileCompletionCardProps = {
  theme: AppTheme;
  progress: number;
  completedSteps: number;
  totalSteps: number;
  onPress: () => void;
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const ProfileCompletionCardComponent = ({
  theme,
  progress,
  completedSteps,
  totalSteps,
  onPress,
}: ProfileCompletionCardProps) => {
  const styles = useMemo(() => createStyles(theme), [theme]);
  const scale = useSharedValue(1);

  const onPressIn = () => {
    scale.value = withSpring(0.97, { damping: 15, stiffness: 220 });
  };

  const onPressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 220 });
  };

  return (
    <View style={styles.container} accessibilityRole="summary">
      <View style={styles.copyColumn}>
        <Text style={styles.title}>Complete your profile to unlock personalized farming recommendations.</Text>
        <Text style={styles.subtitle}>{`${completedSteps} of ${totalSteps} details added`}</Text>
      </View>

      <AnimatedPressable
        style={[styles.button]}
        onPress={onPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        accessibilityRole="button"
        accessibilityLabel="Complete Profile"
      >
        <Text style={styles.buttonText}>Complete</Text>
      </AnimatedPressable>
    </View>
  );
};

export const ProfileCompletionCard = memo(ProfileCompletionCardComponent);

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: Spacing.lg,
        paddingVertical: Spacing.sm,
        borderRadius: Radius.lg,
      },
      copyColumn: {
        flex: 1,
        gap: Spacing.xs,
      },
      title: {
        color: theme.text,
        fontSize: Typography.body.fontSize,
        fontWeight: '700',
      },
      subtitle: {
        color: theme.textMuted,
        fontSize: Typography.small.fontSize,
        fontWeight: '600',
      },
      button: {
        paddingHorizontal: Spacing.md,
        paddingVertical: 8,
        borderRadius: Radius.full,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: theme.text,
        marginLeft: Spacing.sm,
        alignSelf: 'center',
      },
      buttonText: {
        color: theme.text,
        fontSize: Typography.bodyMedium.fontSize,
        fontWeight: '800',
      },
  });
