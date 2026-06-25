import React, { useMemo } from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import { Grid3X3, Camera, User } from 'lucide-react-native';
import { Colors, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

type AppTheme = typeof Colors.light;

interface ProfileTabsProps {
  activeTab: 'grid' | 'reels' | 'tags';
  setActiveTab: (tab: 'grid' | 'reels' | 'tags') => void;
}

const ProfileTabs = ({ activeTab, setActiveTab }: ProfileTabsProps) => {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'] as AppTheme;
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <View style={styles.tabBar}>
      <Pressable
        style={[styles.tabItem, activeTab === 'grid' && styles.tabItemActive]}
        onPress={() => setActiveTab('grid')}
      >
        <Grid3X3
          size={24}
          color={activeTab === 'grid' ? theme.text : theme.textMuted}
          strokeWidth={activeTab === 'grid' ? 2.5 : 1.5}
        />
      </Pressable>
      <Pressable
        style={[styles.tabItem, activeTab === 'reels' && styles.tabItemActive]}
        onPress={() => setActiveTab('reels')}
      >
        <Camera
          size={24}
          color={activeTab === 'reels' ? theme.text : theme.textMuted}
          strokeWidth={activeTab === 'reels' ? 2.5 : 1.5}
        />
      </Pressable>
      <Pressable
        style={[styles.tabItem, activeTab === 'tags' && styles.tabItemActive]}
        onPress={() => setActiveTab('tags')}
      >
        <User
          size={24}
          color={activeTab === 'tags' ? theme.text : theme.textMuted}
          strokeWidth={activeTab === 'tags' ? 2.5 : 1.5}
        />
      </Pressable>
    </View>
  );
};

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    tabBar: {
      flexDirection: 'row',
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: theme.borderLight,
    },
    tabItem: {
      flex: 1,
      alignItems: 'center',
      paddingVertical: Spacing.sm,
    },
    tabItemActive: {
      borderBottomWidth: 1.5,
      borderBottomColor: theme.text,
    },
  });

export default ProfileTabs;
