import { Heart } from 'lucide-react-native';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Colors, Radius, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

type AppTheme = typeof Colors.light;

interface FeedActionBarProps {
  isLiked: boolean;
  isLiking: boolean;
  likesCount: number;
  commentsCount: number;
  onLike?: () => void;
  onComment?: () => void;
  onShare?: () => void;
}

export default function FeedActionBar({ isLiked, isLiking, likesCount, commentsCount, onLike, onComment, onShare }: FeedActionBarProps) {
  const { t } = useTranslation('feed');
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'] as AppTheme;
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <View style={styles.bar}>
      <Pressable
        onPress={onLike}
        disabled={isLiking}
        style={({ pressed }) => [styles.action, pressed && styles.pressed]}
      >
        <View style={[styles.iconTextContainer]}>

          <Heart
            size={24}
            width={24}
            height={24}
            color={isLiked ? theme.red : theme.textSecondary}
            fill={isLiked ? theme.red : 'transparent'}
          />
          <Text style={[styles.label, isLiked && styles.labelLiked]}>{likesCount}</Text>
        </View>
      </Pressable>

      {/* Do not remove these buttons */}
      {/* <Pressable
        onPress={onComment}
        style={({ pressed }) => [styles.action, pressed && styles.pressed]}
      >
        <View style={[styles.iconTextContainer]}>
          <MessageCircle size={24} color={theme.textSecondary} />
          <Text style={styles.label}>{commentsCount}</Text>
        </View>
      </Pressable>

      <Pressable
        onPress={onShare}
        style={({ pressed }) => [styles.action, pressed && styles.pressed]}
      >
        <View style={[styles.iconTextContainer]}>
          <Send size={24} color={theme.textSecondary} />
          <Text style={styles.label}>{t('share')}</Text>
        </View>
      </Pressable> */}
    </View>
  );
}

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    bar: {
      // backgroundColor: "red",
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.xxl,
      paddingTop: Spacing.md,
    },
    action: {
      flexDirection: 'row',
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      gap: Spacing.xs,
      paddingVertical: 8,
      paddingHorizontal: Spacing.xs,
      borderRadius: Radius.md,
      minHeight: 44,
    },
    pressed: {
      opacity: 0.6,
    },
    iconTextContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: Spacing.xs,
    },
    label: {
      color: theme.textSecondary,
      fontSize: 16,
      fontWeight: '500',
    },
    labelLiked: {
      color: theme.red,
    },
  });
