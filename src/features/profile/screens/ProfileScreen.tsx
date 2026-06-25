import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import React, { useEffect, useMemo, useRef } from 'react';
import { Alert, FlatList, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

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

  const hasShownEmptyAlert = useRef(false);

  useEffect(() => {
    if (
      !hasShownEmptyAlert.current &&
      postsData &&
      postsData.data?.posts?.length === 0
    ) {
      hasShownEmptyAlert.current = true;

      Alert.alert(t('noPosts'), t('noPostsMessage'));
    }
  }, [postsData]);

  const posts = postsData?.data?.posts ?? [];

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
  });