import { memo, useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { ImageIcon } from 'lucide-react-native';

import { Colors, Spacing, Typography } from '@/constants/theme';

import { PROFILE_EMPTY_COPY } from '../constants/profile.constants';
import type { ProfileEmptyStateVariant } from '../types/profile.types';

type AppTheme = typeof Colors.light;

type EmptyPostsStateProps = {
  theme: AppTheme;
  variant: ProfileEmptyStateVariant;
};

const EmptyPostsStateComponent = ({ theme, variant }: EmptyPostsStateProps) => {
  const styles = useMemo(() => createStyles(theme), [theme]);
  const copy = PROFILE_EMPTY_COPY[variant];

  return (
    <View style={styles.container} accessibilityRole="summary">
      <View style={styles.iconWrap}>
        <ImageIcon size={34} color={theme.textMuted} strokeWidth={1.8} />
      </View>

      <Text style={styles.title}>{copy.title}</Text>
      <Text style={styles.subtitle}>{copy.subtitle}</Text>
    </View>
  );
};

export const EmptyPostsState = memo(EmptyPostsStateComponent);

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: Spacing.lg,
        paddingHorizontal: Spacing.lg,
        gap: Spacing.sm,
      },
      iconWrap: {
        width: 52,
        height: 52,
        borderRadius: 52,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent',
        marginBottom: Spacing.xs,
      },
      title: {
        color: theme.text,
        fontSize: Typography.h3.fontSize,
        lineHeight: Typography.h3.lineHeight,
        fontWeight: '700',
        textAlign: 'center',
      },
      subtitle: {
        maxWidth: 280,
        color: theme.textMuted,
        fontSize: Typography.body.fontSize,
        lineHeight: Typography.body.lineHeight,
        fontWeight: '500',
        textAlign: 'center',
      },
  });
