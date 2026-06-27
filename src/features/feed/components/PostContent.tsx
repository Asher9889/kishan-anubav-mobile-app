import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Colors, Typography } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

type AppTheme = typeof Colors.light;

interface PostContentProps {
  text: string;
}

const MAX_LINES = 4;
const LONG_TEXT_THRESHOLD = 200;

export default function PostContent({ text }: PostContentProps) {
  const { t } = useTranslation('feed');
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'] as AppTheme;
  const styles = createStyles(theme);
  const [expanded, setExpanded] = useState(false);

  if (!text.trim()) return null;

  const isLong = text.length > LONG_TEXT_THRESHOLD || text.split('\n').length > MAX_LINES;

  return (
    <View style={styles.wrapper}>
      <Text
        style={styles.text}
        numberOfLines={expanded ? undefined : MAX_LINES}
      >
        {text}
      </Text>
      {!expanded && isLong && (
        <Pressable onPress={() => setExpanded(true)} hitSlop={8}>
          <Text style={styles.seeMore}>{t('seeMore')}</Text>
        </Pressable>
      )}
    </View>
  );
}

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    wrapper: {
      marginTop: 14,
    },
    text: {
      fontSize: Typography.body.fontSize,
      lineHeight: Typography.body.lineHeight,
      color: theme.text,
    },
    seeMore: {
      marginTop: 6,
      fontSize: Typography.bodyMedium.fontSize,
      fontWeight: '500',
      color: theme.primary,
    },
  });
