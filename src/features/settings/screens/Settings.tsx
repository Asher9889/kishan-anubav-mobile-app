import i18n from '@/i18n';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useAuthStore } from '@/features/auth/store/auth.store';
import LogoutButton from '@/features/settings/components/LogoutButton';
import SectionDivider from '@/features/settings/components/SectionDivider';
import SectionHeader from '@/features/settings/components/SectionHeader';
import SettingItem from '@/features/settings/components/SettingItem';
import * as SecureStore from "expo-secure-store";

export default function SettingsScreen() {
  const { t } = useTranslation('common');
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const theme = isDark ? Colors.dark : Colors.light;
  const [curretLanguage, setCurrentLanguage] = React.useState(i18n.language);
  const {logout} = useAuthStore();

  const handleLogout = async () => {
    await SecureStore.deleteItemAsync("refreshToken");
    logout();
    Alert.alert(t('settings.loggedOut'), t('settings.loggedOutMessage'));
  };

  const handleNotifications = () => {
    Alert.alert(t('settings.notifications'), '');
  };

  const handleLanguage = () => {
    const nextLang = i18n.language === 'hi' ? 'en' : 'hi';
    i18n.changeLanguage(nextLang);
    setCurrentLanguage(nextLang);
  };

  const handlePrivacy = () => {
    Alert.alert(t('settings.privacyPolicy'), '');
  };

  const handleTerms = () => {
    Alert.alert(t('settings.termsConditions'), '');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={['top']}>
      <ScrollView>
        <SectionHeader title={t('settings.title')} />

        <View style={[styles.cardSection, { backgroundColor: theme.card, borderColor: theme.borderLight }]}>
          <SettingItem
            icon="notifications-outline"
            label={t('settings.notifications')}
            onPress={handleNotifications}
          />
          <TouchableOpacity onPress={handleLanguage} style={[styles.langRow, { borderBottomColor: theme.borderLight }]}>
            <View style={styles.langLeft}>
              <Ionicons name="language-outline" size={22} color={theme.primary} style={styles.langIcon} />
              <Text style={[styles.langLabel, { color: theme.text }]}>{t('settings.language')}</Text>
            </View>
            <View style={styles.langRight}>
              <Text style={[styles.langValue, { color: theme.textMuted }]}>{curretLanguage === 'hi' ? 'हिन्दी' : 'English'}</Text>
              <Ionicons name="chevron-forward" size={18} color={theme.textMuted} />
            </View>
          </TouchableOpacity>
          <SettingItem
            icon="document-text-outline"
            label={t('settings.privacyPolicy')}
            onPress={handlePrivacy}
          />
          <SettingItem
            icon="shield-checkmark-outline"
            label={t('settings.termsConditions')}
            onPress={handleTerms}
          />
        </View>

        <SectionDivider />

        <LogoutButton onLogout={handleLogout} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  cardSection: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
  },
  langRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  langLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  langIcon: {
    marginRight: 12,
    width: 24,
    textAlign: 'center',
  },
  langLabel: {
    fontSize: 16,
  },
  langRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  langValue: {
    fontSize: 16,
  },
});