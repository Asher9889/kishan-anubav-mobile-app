import { Heart, MessageCircle } from 'lucide-react-native';
import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Colors, Typography } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

type AppTheme = typeof Colors.light;

interface EngagementSummaryProps {
  likesCount: number;
  commentsCount: number;
}

export default function EngagementSummary({ likesCount, commentsCount }: EngagementSummaryProps) {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'] as AppTheme;
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <View style={styles.row}>
      <View style={styles.stat}>
        <Heart size={14} color={theme.textMuted} fill={theme.textMuted} />
        <Text style={styles.text}>{likesCount}</Text>
      </View>
      <View style={styles.stat}>
        <MessageCircle size={14} color={theme.textMuted} />
        <Text style={styles.text}>{commentsCount}</Text>
      </View>
    </View>
  );
}

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 16,
      paddingVertical: 12,
    },
    stat: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 5,
    },
    text: {
      color: theme.textMuted,
      fontSize: Typography.caption.fontSize,
    },
  });
