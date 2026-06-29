import { Colors, Radius, Spacing, Typography } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { MessageCircle, Share2, UserPlus } from 'lucide-react-native';
import React, { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

type AppTheme = typeof Colors.light;

interface UserProfileActionsProps {
  onFollow?: () => void;
  onMessage?: () => void;
  onShare?: () => void;
}

const UserProfileActions = ({ onFollow, onMessage, onShare }: UserProfileActionsProps) => {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'] as AppTheme;
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <View style={styles.actionButtonsRow}>
      <Pressable
        style={styles.primaryButton}
        onPress={onFollow}
        accessibilityRole="button"
      >
        <UserPlus size={18} color={theme.onPrimary} />
        <Text style={styles.primaryButtonText}>Follow</Text>
      </Pressable>
      <Pressable
        style={styles.primaryButton}
        onPress={onMessage}
        accessibilityRole="button"
      >
        <MessageCircle size={18} color={theme.text} />
        <Text style={styles.secondaryButtonText}>Message</Text>
      </Pressable>
      <Pressable
        style={styles.iconButton}
        onPress={onShare}
        accessibilityRole="button"
      >
        <Share2 size={18} color={theme.text} />
      </Pressable>
    </View>
  );
};

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    actionButtonsRow: {
      flexDirection: 'row',
      paddingHorizontal: Spacing.lg,
      gap: Spacing.sm,
      marginBottom: Spacing.md,
    },
    primaryButton: {
      flex: 1,
      backgroundColor: theme.primary,
      paddingVertical: 8,
      borderRadius: Radius.md,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
      gap: 6,
    },
    primaryButtonText: {
      color: theme.onPrimary,
      fontSize: Typography.bodyMedium.fontSize,
      fontWeight: '600',
    },
    secondaryButtonText: {
      color: theme.text,
      fontSize: Typography.bodyMedium.fontSize,
      fontWeight: '600',
    },
    iconButton: {
      width: 36,
      height: 36,
      backgroundColor: theme.surfaceContainerLow,
      borderRadius: Radius.md,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: theme.borderLight,
    },
  });

export default UserProfileActions;
