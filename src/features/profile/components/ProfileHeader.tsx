import { Colors, Spacing, Typography } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { router } from 'expo-router';
import { AtSign, ChevronLeft, ChevronRight, Plus, Settings } from 'lucide-react-native';
import React, { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

type AppTheme = typeof Colors.light;

interface ProfileHeaderProps {
  username: string;
}

const ProfileHeader = ({ username }: ProfileHeaderProps) => {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'] as AppTheme;
  const styles = useMemo(() => createStyles(theme), [theme]);

  const hasUsername = username.trim().length > 0;

  return (
    <View style={styles.instagramTopBar}>
      <Pressable onPress={() => router.push("/(private)/(tabs)")} accessibilityRole="button">
        <ChevronLeft size={28} color={theme.text} strokeWidth={2.2} />
      </Pressable>
      {hasUsername ? (
        <View style={styles.usernameHeader}>
          <AtSign size={16} color={theme.text} />
          <Text style={styles.usernameHeaderText}>{username.trim()}</Text>
          <ChevronRight size={16} color={theme.text} style={{ transform: [{ rotate: '90deg' }] }} />
        </View>
      ) : <View />}
      <View style={styles.topBarRight}>
        <Pressable onPress={() => router.push("/(private)/(stack)/knowledge/create")} style={styles.topBarIcon} accessibilityRole="button">
          <Plus size={24} color={theme.text} strokeWidth={2} />
        </Pressable>
        <Pressable onPress={() => router.push("/(private)/(stack)/settings")} style={styles.topBarIcon} accessibilityRole="button">
          <Settings size={24} color={theme.text} strokeWidth={2} />
        </Pressable>
      </View>
    </View>
  );
};

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    instagramTopBar: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: Spacing.md,
      paddingVertical: Spacing.sm,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: theme.borderLight,
    },
    usernameHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
    usernameHeaderText: {
      color: theme.text,
      fontSize: Typography.h3.fontSize,
      fontWeight: '700',
    },
    topBarRight: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.md,
    },
    topBarIcon: {
      padding: Spacing.xs,
    },
  });

export default ProfileHeader;
