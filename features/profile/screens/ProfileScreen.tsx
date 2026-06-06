import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import React, { useEffect, useMemo } from 'react';
import { Alert, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import PostsFeed from '../components/PostsFeed';
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
  const profileForm = useProfileForm();
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'] as AppTheme;
  const styles = useMemo(() => createStyles(theme), [theme]);

  const { data: postsData } = usePostDataFetcher();

  console.log('Fetched posts data:', postsData);

  useEffect(() => {
    if (
      postsData &&
      postsData.data?.posts?.length === 0
    ) {
      Alert.alert(
        'No Posts',
        "You haven't made any posts yet. Start sharing your knowledge and experiences with the community!"
      );
    }
  }, [postsData]);






  return (
    <>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <ProfileHeader username={profileForm.profile.username} />

        <ScrollView showsVerticalScrollIndicator={false}>
          <ProfileStats
            onPickAvatar={profileForm.onPickAvatar}
          />

          <ProfileBio profile={profileForm.profile} />

          <ProfileActions onEditPress={() => profileForm.setIsEditing(true)} />

          {/* <StoryHighlights /> */}

          <ProfileTabs
            activeTab={profileForm.activeTab}
            setActiveTab={profileForm.setActiveTab}
          />

          {/* <PostsGrid  activeTab={profileForm.activeTab} /> */}

          <PostsFeed posts={postsData?.data?.posts || []} />

        </ScrollView>
        <EditProfileModal
          isOpen={profileForm.isEditing}
          onClose={() => profileForm.setIsEditing(false)}
          profileForm={profileForm}
        />
      </SafeAreaView>

    </>
  );
}

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: theme.background,
    },
  });
