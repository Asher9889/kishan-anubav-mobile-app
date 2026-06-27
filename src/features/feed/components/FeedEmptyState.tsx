import { router } from 'expo-router';
import { Sprout } from 'lucide-react-native';
import { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Colors, Radius, Spacing, Typography } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

type AppTheme = typeof Colors.light;

export default function FeedEmptyState() {
  const { t } = useTranslation('feed');
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'] as AppTheme;
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <View style={styles.container}>
      <View style={styles.iconWrap}>
        <Sprout size={48} color={theme.primary} />
      </View>
      <Text style={styles.title}>{t('emptyTitle')}</Text>
      <Text style={styles.message}>{t('emptyMessage')}</Text>
      <Pressable
        onPress={() => router.push('/(private)/(stack)/knowledge/create')}
        style={({ pressed }) => [styles.button, pressed && styles.pressed]}
      >
        <Text style={styles.buttonText}>{t('createFirstPost')}</Text>
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
    iconWrap: {
      width: 80,
      height: 80,
      borderRadius: Radius.full,
      backgroundColor: theme.primaryMuted,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: Spacing.sm,
    },
    title: {
      fontSize: Typography.h3.fontSize,
      fontWeight: '700',
      color: theme.text,
      textAlign: 'center',
    },
    message: {
      fontSize: Typography.body.fontSize,
      color: theme.textSecondary,
      textAlign: 'center',
      lineHeight: Typography.body.lineHeight,
    },
    button: {
      marginTop: Spacing.md,
      backgroundColor: theme.primary,
      paddingHorizontal: Spacing.lg,
      paddingVertical: 12,
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
