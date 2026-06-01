import React, { useMemo } from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { Image } from 'expo-image';
import { Camera, Plus } from 'lucide-react-native';
import { Colors, Spacing, Typography } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

type AppTheme = typeof Colors.light;

interface ProfileStatsProps {
  avatarUri: string;
  onPickAvatar: () => void;
}

const ProfileStats = ({ avatarUri, onPickAvatar }: ProfileStatsProps) => {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'] as AppTheme;
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <View style={styles.profileHeader}>
      <Pressable onPress={onPickAvatar} style={styles.avatarWrapper} accessibilityRole="button">
        {avatarUri ? (
          <Image source={{ uri: avatarUri }} style={styles.avatarLarge} contentFit="cover" />
        ) : (
          <View style={styles.avatarFallbackLarge}>
            <Camera size={32} color={theme.textMuted} />
          </View>
        )}
        {avatarUri && (
          <View style={styles.addStoryBadge}>
            <Plus size={14} color="#fff" strokeWidth={3} />
          </View>
        )}
      </Pressable>

      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>46</Text>
          <Text style={styles.statLabel}>posts</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>1,525</Text>
          <Text style={styles.statLabel}>followers</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>2,142</Text>
          <Text style={styles.statLabel}>following</Text>
        </View>
      </View>
    </View>
  );
};

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    profileHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: Spacing.lg,
      paddingVertical: Spacing.lg,
      gap: Spacing.lg,
    },
    avatarWrapper: {
      position: 'relative',
    },
    avatarLarge: {
      width: 86,
      height: 86,
      borderRadius: 43,
      backgroundColor: theme.surfaceContainerLow,
    },
    avatarFallbackLarge: {
      width: 86,
      height: 86,
      borderRadius: 43,
      backgroundColor: theme.surfaceContainerLow,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: theme.borderLight,
    },
    addStoryBadge: {
      position: 'absolute',
      bottom: 0,
      right: 0,
      width: 24,
      height: 24,
      borderRadius: 12,
      backgroundColor: theme.primary,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 2,
      borderColor: theme.background,
    },
    statsContainer: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'space-around',
    },
    statItem: {
      alignItems: 'center',
    },
    statNumber: {
      color: theme.text,
      fontSize: Typography.h3.fontSize,
      fontWeight: '700',
    },
    statLabel: {
      color: theme.textSecondary,
      fontSize: Typography.small.fontSize,
      marginTop: 2,
    },
  });

export default ProfileStats;
