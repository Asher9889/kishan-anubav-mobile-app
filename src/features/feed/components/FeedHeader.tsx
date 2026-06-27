import { Search } from 'lucide-react-native';
import { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Colors, Spacing, Typography } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

type AppTheme = typeof Colors.light;

export default function FeedHeader() {
  const { t } = useTranslation('feed');
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'] as AppTheme;
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <View style={styles.header}>
      <Text style={styles.title}>{t('title')}</Text>
      <Pressable style={({ pressed }) => [styles.search, pressed && styles.pressed]} hitSlop={8}>
        <Search size={22} color={theme.textSecondary} />
      </Pressable>
    </View>
  );
}

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: Spacing.xl,
      paddingVertical: 14,
      borderBottomWidth: 2,
      borderBottomColor: theme.borderLight,
      backgroundColor: theme.card,
    },
    title: {
      fontSize: Typography.h1.fontSize,
      fontWeight: '800',
      color: theme.text,
    },
    search: {
      width: 40,
      height: 40,
      borderRadius: 20,
      alignItems: 'center',
      justifyContent: 'center',
    },
    pressed: {
      opacity: 0.6,
    },
  });
