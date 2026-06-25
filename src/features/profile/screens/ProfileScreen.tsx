import { Colors, Spacing, Typography } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import React, { useMemo } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { Inbox } from 'lucide-react-native';

import PostCard from '../components/PostCard';
import ProfileActions from '../components/ProfileActions';
import ProfileBio from '../components/ProfileBio';
import ProfileHeader from '../components/ProfileHeader';
import ProfileStats from '../components/ProfileStats';
import ProfileTabs from '../components/ProfileTabs';
import EditProfileModal from '../components/edit/EditProfileModal';
import usePostDataFetcher from '../hooks/usePostFetcher';
import { useProfileForm } from '../hooks/useProfileForm';

type AppTheme = typeof Colors.light;

export default function ProfileScreen() {
  const { t } = useTranslation('profile');
  const profileForm = useProfileForm();
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'] as AppTheme;
  const styles = useMemo(() => createStyles(theme), [theme]);

  const { data: postsData } = usePostDataFetcher();

  const posts = postsData?.data?.posts ?? [];
  const isLoading = !postsData;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ProfileHeader username={profileForm.profile.username} />

      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <PostCard post={item} />
        )}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <>
            <ProfileStats
              onPickAvatar={profileForm.onPickAvatar}
            />

            <ProfileBio
              profile={profileForm.profile}
            />

            <ProfileActions
              onEditPress={() =>
                profileForm.setIsEditing(true)
              }
            />

            <ProfileTabs
              activeTab={profileForm.activeTab}
              setActiveTab={profileForm.setActiveTab}
            />
          </>
        }
        ListEmptyComponent={
          isLoading ? null : (
            <View style={styles.emptyState}>
              <Inbox size={48} color={theme.textSecondary} strokeWidth={1.5} />
              <Text style={styles.emptyTitle}>{t('noPosts')}</Text>
              <Text style={styles.emptyMessage}>{t('noPostsMessage')}</Text>
            </View>
          )
        }
      />

      <EditProfileModal
        isOpen={profileForm.isEditing}
        onClose={() => profileForm.setIsEditing(false)}
        profileForm={profileForm}
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