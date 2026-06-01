import React, { useMemo } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

import { useProfileForm } from '../hooks/useProfileForm';
import ProfileHeader from '../components/ProfileHeader';
import ProfileStats from '../components/ProfileStats';
import ProfileBio from '../components/ProfileBio';
import ProfileActions from '../components/ProfileActions';
import StoryHighlights from '../components/StoryHighlights';
import ProfileTabs from '../components/ProfileTabs';
import PostsGrid from '../components/PostsGrid';
import EditProfileModal from '../components/edit/EditProfileModal';

type AppTheme = typeof Colors.light;

export default function ProfileScreen() {
  const profileForm = useProfileForm();
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'] as AppTheme;
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <ProfileHeader username={profileForm.profile.username} />

        <ScrollView showsVerticalScrollIndicator={false}>
          <ProfileStats
            avatarUri={profileForm.profile.avatarUri}
            onPickAvatar={profileForm.onPickAvatar}
          />

          <ProfileBio profile={profileForm.profile} />

          <ProfileActions onEditPress={() => profileForm.setIsEditing(true)} />

          <StoryHighlights />

          <ProfileTabs
            activeTab={profileForm.activeTab}
            setActiveTab={profileForm.setActiveTab}
          />

          <PostsGrid activeTab={profileForm.activeTab} />
        </ScrollView>
      </SafeAreaView>

      <EditProfileModal
        isOpen={profileForm.isEditing}
        onClose={() => profileForm.setIsEditing(false)}
        profileForm={profileForm}
      />
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
