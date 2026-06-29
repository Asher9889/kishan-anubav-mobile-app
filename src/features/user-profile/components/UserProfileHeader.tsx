import { Colors, Spacing, Typography } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { router } from 'expo-router';
import { AtSign, ChevronLeft } from 'lucide-react-native';
import React, { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

type AppTheme = typeof Colors.light;

interface UserProfileHeaderProps {
  username: string;
}

const UserProfileHeader = ({ username }: UserProfileHeaderProps) => {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'] as AppTheme;
  const styles = useMemo(() => createStyles(theme), [theme]);

  const hasUsername = username.trim().length > 0;

  return (
    <View style={styles.topBar}>
      <Pressable onPress={() => router.back()} accessibilityRole="button">
        <ChevronLeft size={28} color={theme.text} strokeWidth={2.2} />
      </Pressable>
      {hasUsername ? (
        <View style={styles.usernameHeader}>
          <AtSign size={16} color={theme.text} />
          <Text style={styles.usernameHeaderText}>{username.trim()}</Text>
        </View>
      ) : (
        <View />
      )}
      <View style={styles.placeholder} />
    </View>
  );
};

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    topBar: {
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
    placeholder: {
      width: 28,
    },
  });

export default UserProfileHeader;
