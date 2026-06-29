import { Colors, Spacing, Typography } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Image } from 'expo-image';
import { Camera } from 'lucide-react-native';
import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

type AppTheme = typeof Colors.light;

interface UserProfileStatsProps {
  avatarUri: string;
  name: string;
  postsCount: number;
  followersCount: number;
  followingCount: number;
}

const UserProfileStats = ({ avatarUri, name, postsCount, followersCount, followingCount }: UserProfileStatsProps) => {
  const { t } = useTranslation(['common', 'profile']);
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'] as AppTheme;
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <View style={styles.profileHeader}>
      <View style={styles.avatarWrapper}>
        {avatarUri ? (
          <Image cachePolicy="none" source={{ uri: avatarUri }} style={styles.avatarLarge} contentFit="cover" />
        ) : (
          <View style={styles.avatarFallbackLarge}>
            <Camera size={32} color={theme.textMuted} />
          </View>
        )}
      </View>

      <View style={styles.nameColumn}>
        <Text style={styles.userNameText}>{name}</Text>
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{postsCount}</Text>
            <Text style={styles.statLabel}>{t('profile:posts', { defaultValue: 'Posts' })}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{followersCount}</Text>
            <Text style={styles.statLabel}>{t('profile:followers', { defaultValue: 'Followers' })}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{followingCount}</Text>
            <Text style={styles.statLabel}>{t('profile:following', { defaultValue: 'Following' })}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    profileHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: Spacing.lg,
      paddingVertical: Spacing.lg,
      gap: Spacing.lg,
    },
    avatarWrapper: {
      position: 'relative',
    },
    avatarLarge: {
      width: 86,
      height: 86,
      borderRadius: 43,
      backgroundColor: theme.surfaceContainerLow,
    },
    avatarFallbackLarge: {
      width: 86,
      height: 86,
      borderRadius: 43,
      backgroundColor: theme.surfaceContainerLow,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: theme.borderLight,
    },
    nameColumn: {
      flexDirection: 'column',
      gap: Spacing.sm,
    },
    userNameText: {
      color: theme.text,
      fontSize: Typography.h3.fontSize,
      fontWeight: '700',
    },
    statsRow: {
      flexDirection: 'row',
      gap: Spacing.lg,
    },
    statItem: {
      alignItems: 'center',
    },
    statNumber: {
      color: theme.text,
      fontSize: Typography.h3.fontSize,
      fontWeight: '700',
    },
    statLabel: {
      color: theme.textSecondary,
      fontSize: Typography.small.fontSize,
      fontWeight: '500',
      marginTop: 2,
    },
  });

export default UserProfileStats;
