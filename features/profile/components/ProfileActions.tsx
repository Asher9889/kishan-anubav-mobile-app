import React, { useMemo } from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { User } from 'lucide-react-native';
import { Colors, Radius, Spacing, Typography } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

type AppTheme = typeof Colors.light;

interface ProfileActionsProps {
  onEditPress: () => void;
}

const ProfileActions = ({ onEditPress }: ProfileActionsProps) => {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'] as AppTheme;
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <View style={styles.actionButtonsRow}>
      <Pressable
        style={styles.primaryButton}
        onPress={onEditPress}
        accessibilityRole="button"
      >
        <Text style={styles.primaryButtonText}>Edit profile</Text>
      </Pressable>
      <Pressable style={styles.primaryButton} accessibilityRole="button">
        <Text style={styles.primaryButtonText}>Share profile</Text>
      </Pressable>
      <Pressable style={styles.iconButton} accessibilityRole="button">
        <User size={18} color={theme.text} />
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
      backgroundColor: theme.surfaceContainerLow,
      paddingVertical: 8,
      borderRadius: Radius.md,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: theme.borderLight,
    },
    primaryButtonText: {
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

export default ProfileActions;
