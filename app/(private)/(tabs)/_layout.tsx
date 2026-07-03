import { HapticTab } from '@/components/haptic-tab';
import TabAvatar from '@/components/TabAvatar';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Tabs } from 'expo-router';
import { Bot, House, Newspaper } from 'lucide-react-native';
import React from 'react';
import { useTranslation } from 'react-i18next';

type AppTheme = typeof Colors.light;

export default function TabLayout() {
  const { t } = useTranslation('common');
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'] as AppTheme;

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.tint,
        headerShown: false,
        tabBarButton: HapticTab,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: t('tabs.home'),
          tabBarIcon: ({ color }) => <House size={28}  color={color} />,
        }}
      />
      <Tabs.Screen
        name="feed"
        options={{
          title: t('tabs.feed'),
          tabBarIcon: ({ color }) => <Newspaper size={28}  color={color} />,
        }}
      />
      <Tabs.Screen
        name="ai-chat"
        options={{
          title: t('tabs.aiChat'),
          tabBarIcon: ({ color }) => <Bot size={32} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: t('tabs.profile'),
          tabBarIcon: ({ focused }) =>  <TabAvatar focused={focused} />,
        }}
      />
    </Tabs>
  );
}
