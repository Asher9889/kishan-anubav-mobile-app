import { Colors, Spacing, Typography } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { AlertTriangle, Inbox } from 'lucide-react-native';
import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import PostCard from '@/features/profile/components/PostCard';
import ProfileTabs from '@/features/profile/components/ProfileTabs';
import type { Post } from '@/features/profile/types/profile.types';

import UserProfileActions from '../components/UserProfileActions';
import UserProfileBio from '../components/UserProfileBio';
import UserProfileHeader from '../components/UserProfileHeader';
import UserProfileStats from '../components/UserProfileStats';
import { useFollowToggle } from '../hooks/useFollowToggle';
import { useUserProfile } from '../hooks/useUserProfile';

type AppTheme = typeof Colors.light;

export default function UserProfileScreen() {
  const { t } = useTranslation('profile');
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'] as AppTheme;
  const styles = useMemo(() => createStyles(theme), [theme]);

  const { user, isLoading, error, posts, isLoadingPosts, userId } = useUserProfile();
  const followMutation = useFollowToggle(userId);
  const [activeTab, setActiveTab] = useState<'grid' | 'reels' | 'tags'>('grid');

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <UserProfileHeader username="" />
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={theme.primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (error || !user) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <UserProfileHeader username="" />
        <View style={styles.centerContainer}>
          <AlertTriangle size={48} color={theme.error} strokeWidth={1.5} />
          <Text style={styles.errorTitle}>{t('errorLoadingProfile', 'Could not load profile')}</Text>
          <Text style={styles.errorMessage}>
            {error?.message ?? t('userNotFound', 'User not found')}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const avatarUri = user.avatar?.trim() ?? '';
  const displayName = user.fullName?.trim() || user.name?.trim() || '';

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <UserProfileHeader username={user.username} />

      <FlatList<Post>
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <PostCard post={item} />}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <>
            <UserProfileStats
              avatarUri={avatarUri}
              name={displayName}
              postsCount={user.postsCount}
              followersCount={user.followersCount}
              followingCount={user.followingCount}
            />

            <UserProfileBio
              bio={user.bio}
              occupation={user.occupation}
            />

            <UserProfileActions
              isFollowing={user.isFollowing}
              onFollow={() => followMutation.mutate(user.isFollowing)}
            />

            <ProfileTabs
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />
          </>
        }
        ListEmptyComponent={
          isLoadingPosts ? (
            <View style={styles.emptyState}>
              <ActivityIndicator size="small" color={theme.primary} />
            </View>
          ) : (
            <View style={styles.emptyState}>
              <Inbox size={48} color={theme.textSecondary} strokeWidth={1.5} />
              <Text style={styles.emptyTitle}>{t('noPosts')}</Text>
              <Text style={styles.emptyMessage}>{t('noPostsMessage')}</Text>
            </View>
          )
        }
      />
    </SafeAreaView>
  );
}

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: theme.background,
    },
    centerContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: Spacing.xl,
      gap: Spacing.sm,
    },
    errorTitle: {
      color: theme.text,
      fontSize: Typography.h3.fontSize,
      fontWeight: '700',
      textAlign: 'center',
    },
    errorMessage: {
      color: theme.textSecondary,
      fontSize: Typography.body.fontSize,
      lineHeight: Typography.body.lineHeight,
      textAlign: 'center',
    },
    emptyState: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: Spacing.xxl * 2,
      paddingHorizontal: Spacing.xl,
      gap: Spacing.sm,
    },
    emptyTitle: {
      color: theme.text,
      fontSize: Typography.h3.fontSize,
      fontWeight: '700',
      textAlign: 'center',
    },
    emptyMessage: {
      color: theme.textSecondary,
      fontSize: Typography.body.fontSize,
      lineHeight: Typography.body.lineHeight,
      textAlign: 'center',
    },
  });
