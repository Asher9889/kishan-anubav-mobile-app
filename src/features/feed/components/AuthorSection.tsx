import { router } from 'expo-router';
import { Ellipsis } from 'lucide-react-native';
import { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Colors, Radius, Spacing, Typography } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

type AppTheme = typeof Colors.light;

interface AuthorSectionProps {
  userId: string;
  name: string;
  location: string;
  state: string;
  district: string;
  createdAt: string;
}

function timeAgo(dateString: string): string {
  const diff = Math.max(0, Date.now() - new Date(dateString).getTime());
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(dateString).toLocaleDateString();
}

export default function AuthorSection({ userId, name, location, district, state, createdAt }: AuthorSectionProps) {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'] as AppTheme;
  const styles = useMemo(() => createStyles(theme), [theme]);

  const initial = name.trim().charAt(0).toUpperCase() || '?';
  const locationParts = [district, state].filter(Boolean);
  const locationText = locationParts.length > 0 ? locationParts.join(', ') : null;

  return (
    <View style={styles.row}>
      <Pressable onPress={() => router.push(`/(private)/(stack)/user-profile?id=${userId}`)} style={styles.avatar}>
        <Text style={styles.avatarText}>{initial}</Text>
      </Pressable>

      <Pressable
        onPress={() => router.push(`/(private)/(stack)/user-profile?id=${userId}`)}
        style={styles.info}
      >
        <Text style={styles.name} numberOfLines={1}>{name}</Text>
        <View style={styles.meta}>
          {locationText && (
            <Text style={styles.location} numberOfLines={1}>{locationText}</Text>
          )}
          {locationText && <Text style={styles.dot}>·</Text>}
          <Text style={styles.time}>{timeAgo(createdAt)}</Text>
        </View>
      </Pressable>

      <Pressable style={styles.menu} hitSlop={8}>
        <Ellipsis size={20} color={theme.textSecondary} />
      </Pressable>
    </View>
  );
}

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    row: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    avatar: {
      width: 48,
      height: 48,
      borderRadius: Radius.full,
      backgroundColor: theme.secondary,
      alignItems: 'center',
      justifyContent: 'center',
    },
    avatarText: {
      color: theme.onSecondary,
      fontSize: Typography.h2.fontSize,
      fontWeight: '700',
    },
    info: {
      flex: 1,
      marginLeft: 12,
    },
    name: {
      fontSize: Typography.h3.fontSize,
      fontWeight: '700',
      color: theme.text,
      marginBottom: 2,
    },
    meta: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
    location: {
      fontSize: Typography.caption.fontSize,
      color: theme.textSecondary,
    },
    dot: {
      fontSize: Typography.caption.fontSize,
      color: theme.textMuted,
    },
    time: {
      fontSize: Typography.caption.fontSize,
      color: theme.textMuted,
    },
    menu: {
      padding: Spacing.sm,
      marginLeft: Spacing.xs,
    },
  });
