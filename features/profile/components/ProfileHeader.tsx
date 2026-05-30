import { memo, useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Image } from 'expo-image';

import { Colors, Spacing, Typography } from '@/constants/theme';
import type { AuthUser } from '@/features/auth/types/user';
import type { ProfileStats as ProfileStatsType } from '../types/profile.types';

type AppTheme = typeof Colors.light;

type ProfileHeaderProps = {
  theme: AppTheme;
  user: AuthUser | null;
  fullName: string;
  username: string | null | undefined;
  initials: string;
  stats: ProfileStatsType;
};

const AVATAR_SIZE = 96;

const ProfileHeaderComponent = ({ theme, user, fullName, username, initials, stats }: ProfileHeaderProps) => {
  const styles = useMemo(() => createStyles(theme), [theme]);
  const hasAvatar = Boolean(user?.avatar?.trim());

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <View style={styles.avatarWrap} accessibilityLabel="Profile picture">
          {hasAvatar ? (
            <Image source={{ uri: user?.avatar ?? undefined }} style={styles.avatarImage} contentFit="cover" />
          ) : (
            <View style={styles.avatarFallback}>
              <Text style={styles.initials}>{initials}</Text>
            </View>
          )}
        </View>

        <View style={styles.identityColumn}>
          <Text style={styles.name} numberOfLines={1}>
            {fullName}
          </Text>
          {username ? <Text style={styles.username}>@{username}</Text> : null}

          <View style={styles.statsRow}>
            <View style={styles.statCol}>
              <Text style={styles.statValue}>{stats.posts}</Text>
              <Text style={styles.statLabel}>Posts</Text>
            </View>

            <View style={styles.statCol}>
              <Text style={styles.statValue}>{stats.followers}</Text>
              <Text style={styles.statLabel}>Followers</Text>
            </View>

            <View style={styles.statCol}>
              <Text style={styles.statValue}>{stats.following}</Text>
              <Text style={styles.statLabel}>Following</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

export const ProfileHeader = memo(ProfileHeaderComponent);

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      paddingVertical: Spacing.sm,
      paddingHorizontal: Spacing.lg,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: Spacing.md,
    },
    avatarWrap: {
      width: AVATAR_SIZE,
      height: AVATAR_SIZE,
      borderRadius: AVATAR_SIZE,
      overflow: 'hidden',
      backgroundColor: theme.surfaceContainerLow,
      alignItems: 'center',
      justifyContent: 'center',
    },
    avatarImage: {
      width: '100%',
      height: '100%',
    },
    avatarFallback: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    initials: {
      color: theme.text,
      fontSize: Typography.h3.fontSize,
      fontWeight: '800',
    },
    identityColumn: {
      flex: 1,
      minWidth: 0,
      gap: 6,
      paddingTop: 4,
    },
    name: {
      color: theme.text,
      fontSize: Typography.h3.fontSize,
      fontWeight: '800',
      lineHeight: Typography.h3.lineHeight,
    },
    username: {
      color: theme.textMuted,
      fontSize: Typography.body.fontSize,
      fontWeight: '600',
      lineHeight: Typography.body.lineHeight,
    },
    statsRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: Spacing.sm,
    },
    statCol: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    statValue: {
      color: theme.text,
      fontSize: 18,
      fontWeight: '800',
    },
    statLabel: {
      marginTop: 4,
      color: theme.textMuted,
      fontSize: Typography.small.fontSize,
      fontWeight: '600',
    },
  });
