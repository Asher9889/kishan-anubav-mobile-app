import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Alert } from 'react-native';

function showAlert(t: (key: string) => string) {
  Alert.alert(
    t('profileCompletion.title'),
    t('profileCompletion.message'),
    [
      {
        text: t('profileCompletion.later'),
        onPress: () => { router.back(); },
        style: 'cancel',
      },
      {
        text: t('profileCompletion.goToProfile'),
        onPress: () => router.push('/(private)/(stack)/client-profile'),
      },
    ]
  );
}

export function useProfileCompletionGuard(isProfileCompleted: boolean) {
  const { t } = useTranslation("common");

  return () => {
    if (!isProfileCompleted) {
      showAlert(t);
      return false;
    }

    return true;
  };
}
