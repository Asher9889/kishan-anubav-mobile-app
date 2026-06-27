import { Colors, Spacing, Typography } from '@/constants/theme';
import { useAuthStore } from '@/features/auth/store/auth.store';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Image } from 'expo-image';
import { Camera, Plus } from 'lucide-react-native';
import React, { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

type AppTheme = typeof Colors.light;

interface ProfileStatsProps {
  onPickAvatar: () => void;
}

const ProfileStats = ({ onPickAvatar }: ProfileStatsProps) => {
  const { t } = useTranslation('common');
  const colorScheme = useColorScheme();
  const user = useAuthStore((state) => state.user);
  const avatarUri = user?.avatar?.trim() ?? '';
  const name = user?.fullName?.trim() || user?.name?.trim() || t('home.farmer');
  const theme = Colors[colorScheme ?? 'light'] as AppTheme;
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <View style={styles.profileHeader}>
      <Pressable onPress={onPickAvatar} style={styles.avatarWrapper} accessibilityRole="button">
        {avatarUri ? (
          <Image cachePolicy="none" source={{ uri: avatarUri }} style={styles.avatarLarge} contentFit="cover" />
        ) : (
          <View style={styles.avatarFallbackLarge}>
            <Camera size={32} color={theme.textMuted} />
          </View>
        )}
        {avatarUri && (
          <View style={styles.addStoryBadge}>
            <Plus size={14} color={theme.onPrimary} strokeWidth={3} />
          </View>
        )}
      </Pressable>

      <View style={styles.nameColumn}>
        <Text style={styles.userNameText}>{name}</Text>
        <View style={styles.statsRow}>

          <View style={styles.statItem}>
            <Text style={styles.statNumber}>0</Text>
            <Text style={styles.statLabel}>{t('profile:posts')}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>0</Text>
            <Text style={styles.statLabel}>{t('profile:followers')}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>0</Text>
            <Text style={styles.statLabel}>{t('profile:following')}</Text>
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
    addStoryBadge: {
      position: 'absolute',
      bottom: 0,
      right: 0,
      width: 24,
      height: 24,
      borderRadius: 12,
      backgroundColor: theme.primary,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 2,
      borderColor: theme.background,
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
    statsContainer: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'space-around',
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

export default ProfileStats;
