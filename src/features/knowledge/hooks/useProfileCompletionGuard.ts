import { useAuthStore } from '@/features/auth/store/auth.store';
import { router } from 'expo-router';
import { useCallback } from 'react';
import { Alert } from 'react-native';
import { useTranslation } from 'react-i18next';

type GuardResult = {
  canPost: boolean;
};

/**
 * Checks if the current user's profile is complete before allowing a post.
 * If incomplete, shows a localized farmer-friendly alert with navigation to profile.
 */
export function useProfileCompletionGuard(): () => GuardResult {
  const user = useAuthStore((state) => state.user);
  const { t } = useTranslation('common');

  const guard = useCallback((): GuardResult => {
    const isComplete = user?.isProfileCompleted;
    if (!isComplete) {
      Alert.alert(
        t('profileCompletion.title'),
        t('profileCompletion.message'),
        [
          {
            text: t('profileCompletion.later'),
            style: 'cancel',
          },
          {
            text: t('profileCompletion.goToProfile'),
            onPress: () => router.push('/(private)/(stack)/client-profile'),
          },
        ]
      );
      return { canPost: false };
    }

    return { canPost: true };
  }, [user, t]);

  return guard;
}
