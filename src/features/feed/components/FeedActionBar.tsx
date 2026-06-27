import { Heart, MessageCircle, Send } from 'lucide-react-native';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Colors, Radius, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

type AppTheme = typeof Colors.light;

interface FeedActionBarProps {
  onLike?: () => void;
  onComment?: () => void;
  onShare?: () => void;
}

export default function FeedActionBar({ onLike, onComment, onShare }: FeedActionBarProps) {
  const { t } = useTranslation('feed');
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'] as AppTheme;
  const styles = useMemo(() => createStyles(theme), [theme]);

  const action = (Icon: typeof Heart, label: string, onPress?: () => void) => (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.action, pressed && styles.pressed]}
    >
      <Icon size={20} color={theme.textSecondary} />
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );

  return (
    <View style={styles.bar}>
      {action(Heart, t('like'), onLike)}
      {action(MessageCircle, t('comment'), onComment)}
      {action(Send, t('share'), onShare)}
    </View>
  );
}

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    bar: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.xxl,
      paddingTop: Spacing.md,
    },
    action: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      gap: 4,
      paddingVertical: 8,
      paddingHorizontal: Spacing.xs,
      borderRadius: Radius.md,
      minHeight: 44,
    },
    pressed: {
      opacity: 0.6,
    },
    label: {
      color: theme.textSecondary,
      fontSize: 12,
      fontWeight: '500',
    },
  });
