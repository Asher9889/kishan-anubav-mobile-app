import { memo, useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Colors, Fonts, Spacing, Typography } from '@/constants/theme';

import type { ProfileStats as ProfileStatsType } from '../types/profile.types';

type AppTheme = typeof Colors.light;

type ProfileStatsProps = {
  theme: AppTheme;
  stats: ProfileStatsType;
};

const ProfileStatsComponent = ({ theme, stats }: ProfileStatsProps) => {
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <View style={styles.container} accessibilityRole="summary">
      <View style={styles.statCol} accessibilityRole="button" accessibilityLabel={`${stats.posts} posts`}>
        <Text style={styles.value}>{stats.posts}</Text>
        <Text style={styles.label}>Posts</Text>
      </View>

      <View style={styles.statCol} accessibilityRole="button" accessibilityLabel={`${stats.followers} followers`}>
        <Text style={styles.value}>{stats.followers}</Text>
        <Text style={styles.label}>Followers</Text>
      </View>

      <View style={styles.statCol} accessibilityRole="button" accessibilityLabel={`${stats.following} following`}>
        <Text style={styles.value}>{stats.following}</Text>
        <Text style={styles.label}>Following</Text>
      </View>
    </View>
  );
};

export const ProfileStats = memo(ProfileStatsComponent);

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    statCol: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: Spacing.sm,
    },
    value: {
      color: theme.text,
      fontSize: 20,
      lineHeight: 26,
      fontWeight: '800',
      fontFamily: Fonts.rounded,
    },
    label: {
      marginTop: 2,
      color: theme.textMuted,
      fontSize: Typography.small.fontSize,
      lineHeight: Typography.small.lineHeight,
      fontWeight: '600',
    },
  });
