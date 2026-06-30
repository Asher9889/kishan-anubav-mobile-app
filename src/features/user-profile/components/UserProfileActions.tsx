import { Colors, Radius, Spacing, Typography } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { MessageCircle, Share2, UserCheck, UserPlus } from 'lucide-react-native';
import React, { useCallback, useMemo } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';

type AppTheme = typeof Colors.light;

interface UserProfileActionsProps {
  isFollowing: boolean;
  username?: string;
  onFollow?: () => void;
  onMessage?: () => void;
  onShare?: () => void;
}

const UserProfileActions = ({ isFollowing, username, onFollow, onMessage, onShare }: UserProfileActionsProps) => {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'] as AppTheme;
  const styles = useMemo(() => createStyles(theme), [theme]);

  console.log('UserProfileActions props:', { isFollowing, username });

  const handleFollowPress = useCallback(() => {
    if (isFollowing) {
      Alert.alert(
        'Unfollow',
        username ? `Unfollow @${username}?` : 'Unfollow this user?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Unfollow', style: 'destructive', onPress: onFollow },
        ],
      );
    } else {
      onFollow?.();
    }
  }, [isFollowing, username, onFollow]);

  return (
    <View style={styles.actionButtonsRow}>
      <Pressable
        style={[styles.followButton, isFollowing && styles.followingButton]}
        onPress={handleFollowPress}
        accessibilityRole="button"
      >
        {isFollowing ? (
          <UserCheck size={18} color={theme.text} />
        ) : (
          <UserPlus size={18} color={theme.onPrimary} />
        )}
        <Text style={[styles.followButtonText, isFollowing && styles.followingButtonText]}>
          {isFollowing ? 'Following' : 'Follow'}
        </Text>
      </Pressable>
      <Pressable
        style={styles.secondaryButton}
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
    followButton: {
      flex: 1,
      backgroundColor: theme.primary,
      paddingVertical: 8,
      borderRadius: Radius.md,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
      gap: 6,
    },
    followButtonText: {
      color: theme.onPrimary,
      fontSize: Typography.bodyMedium.fontSize,
      fontWeight: '600',
    },
    followingButton: {
      backgroundColor: theme.surfaceContainerLow,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: theme.borderLight,
    },
    followingButtonText: {
      color: theme.text,
    },
    secondaryButton: {
      flex: 1,
      backgroundColor: theme.surfaceContainerLow,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: theme.borderLight,
      paddingVertical: 8,
      borderRadius: Radius.md,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
      gap: 6,
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
