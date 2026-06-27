import { AlertCircle } from 'lucide-react-native';
import { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Colors, Radius, Spacing, Typography } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

type AppTheme = typeof Colors.light;

interface FeedErrorStateProps {
  onRetry: () => void;
}

export default function FeedErrorState({ onRetry }: FeedErrorStateProps) {
  const { t } = useTranslation('feed');
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'] as AppTheme;
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <View style={styles.container}>
      <AlertCircle size={40} color={theme.error} />
      <Text style={styles.title}>{t('errorTitle')}</Text>
      <Pressable
        onPress={onRetry}
        style={({ pressed }) => [styles.button, pressed && styles.pressed]}
      >
        <Text style={styles.buttonText}>{t('retry')}</Text>
      </Pressable>
    </View>
  );
}

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      alignItems: 'center',
      paddingVertical: Spacing.xxl * 2,
      paddingHorizontal: Spacing.xl,
      gap: Spacing.sm,
    },
    title: {
      fontSize: Typography.body.fontSize,
      color: theme.textSecondary,
      textAlign: 'center',
    },
    button: {
      marginTop: Spacing.sm,
      backgroundColor: theme.primary,
      paddingHorizontal: Spacing.lg,
      paddingVertical: 10,
      borderRadius: Radius.full,
    },
    pressed: {
      opacity: 0.8,
    },
    buttonText: {
      color: theme.onPrimary,
      fontSize: Typography.bodyMedium.fontSize,
      fontWeight: '600',
    },
  });
