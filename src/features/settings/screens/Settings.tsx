// app/settings.tsx
import { useRouter } from 'expo-router';
import React from 'react';
import { Alert, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAuthStore } from '@/features/auth/store/auth.store';
import LogoutButton from '@/features/settings/components/LogoutButton';
import SectionDivider from '@/features/settings/components/SectionDivider';
import SectionHeader from '@/features/settings/components/SectionHeader';
import SettingItem from '@/features/settings/components/SettingItem';
import * as SecureStore from "expo-secure-store";

export default function SettingsScreen() {
  const router = useRouter();
  const {logout} = useAuthStore();

  const handleLogout = async () => {
    // TODO: Replace with your actual auth logic
    // e.g., await supabase.auth.signOut();
    // await AsyncStorage.removeItem('token');
    await SecureStore.deleteItemAsync("refreshToken");
    logout();
    
    Alert.alert('Logged Out', 'You have been successfully logged out.');
    
    // Navigate to login screen
    // router.replace('/login');
  };

  const handleNotifications = () => {
    Alert.alert('Notifications', 'Navigate to notification settings');
  };

  const handleLanguage = () => {
    Alert.alert('Language', 'Navigate to language selection');
  };

  const handlePrivacy = () => {
    Alert.alert('Privacy Policy', 'Open privacy policy page');
  };

  const handleTerms = () => {
    Alert.alert('Terms & Conditions', 'Open terms page');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView>
        <SectionHeader title="Settings" />

        <SettingItem
          icon="notifications-outline"
          label="Notifications"
          onPress={handleNotifications}
        />
        <SettingItem
          icon="language-outline"
          label="Language"
          onPress={handleLanguage}
        />
        <SettingItem
          icon="document-text-outline"
          label="Privacy Policy"
          onPress={handlePrivacy}
        />
        <SettingItem
          icon="shield-checkmark-outline"
          label="Terms & Conditions"
          onPress={handleTerms}
        />

        <SectionDivider />

        <LogoutButton onLogout={handleLogout} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
});