import { useRouter } from 'expo-router';
import { memo, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Colors, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

import { useProfileScreen } from '../hooks/useProfileScreen';
import { ProfileActions } from './ProfileActions';
import { ProfileCompletionCard } from './ProfileCompletionCard';
import { ProfileHeader } from './ProfileHeader';
import { ProfileInfo } from './ProfileInfo';
import { ProfilePostsGrid } from './ProfilePostsGrid';
import { ProfileTabs } from './ProfileTabs';

type AppTheme = typeof Colors.light;

const ProfileScreenComponent = () => {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const theme = Colors[colorScheme ?? 'light'] as AppTheme;
  const styles = useMemo(() => createStyles(theme), [theme]);

  const {
    user,
    fullName,
    username,
    location,
    initials,
    completionProgress,
    isProfileCompleted,
    posts,
    stats,
    activeTab,
    setActiveTab,
  } = useProfileScreen();

  const headerComponent = useMemo(
    () => (
      <View style={styles.headerStack}>
        <ProfileHeader theme={theme} user={user} fullName={fullName} username={username} initials={initials} stats={stats} />

        <ProfileInfo theme={theme} user={user} fullName={fullName} username={username} location={location} isProfileCompleted={isProfileCompleted} />

        <ProfileActions
          theme={theme}
          onEditProfile={() => {
            router.push('/client-profile');
          }}
          onShareProfile={() => {
            // Hook up share sheet later.
          }}
        />

        {!isProfileCompleted ? (
          <ProfileCompletionCard
            theme={theme}
            progress={completionProgress}
            completedSteps={Math.round((completionProgress / 100) * 6)}
            totalSteps={6}
            onPress={() => {
              router.push('/client-profile');
            }}
          />
        ) : null}

        <ProfileTabs theme={theme} value={activeTab} onChange={setActiveTab} />
      </View>
    ),
    [
      activeTab,
      completionProgress,
      fullName,
      initials,
      isProfileCompleted,
      location,
      setActiveTab,
      stats,
      theme,
      user,
      username,
    ]
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ProfilePostsGrid theme={theme} posts={posts} activeTab={activeTab} headerComponent={headerComponent} />
    </SafeAreaView>
  );
};

export const ProfileScreen = memo(ProfileScreenComponent);

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: theme.background,
    },
    headerStack: {
      paddingHorizontal: Spacing.sm,  
      gap: Spacing.md,
      paddingBottom: Spacing.md,
    },
  });
