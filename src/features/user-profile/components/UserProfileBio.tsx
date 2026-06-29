import { Colors, Spacing, Typography } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View } from 'react-native';

type AppTheme = typeof Colors.light;

interface UserProfileBioProps {
  bio: string;
  occupation: string | null;
}

const UserProfileBio = ({ bio, occupation }: UserProfileBioProps) => {
  const { t } = useTranslation('profile');
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'] as AppTheme;
  const styles = useMemo(() => createStyles(theme), [theme]);

  const displayBio = bio.trim() !== '' ? bio : null;

  return (
    <View style={styles.bioSection}>
      {displayBio ? (
        <Text style={styles.bioText}>{displayBio}</Text>
      ) : (
        <Text style={styles.bioEmpty}>{t('bioEmpty')}</Text>
      )}
      {occupation ? (
        <Text style={styles.bioOccupation}>{occupation}</Text>
      ) : null}
    </View>
  );
};

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    bioSection: {
      paddingHorizontal: Spacing.lg,
      paddingBottom: Spacing.md,
      gap: 4,
    },
    bioText: {
      color: theme.text,
      fontSize: Typography.body.fontSize,
      lineHeight: 20,
    },
    bioEmpty: {
      color: theme.textMuted,
      fontSize: Typography.body.fontSize,
      lineHeight: 20,
      fontStyle: 'italic',
    },
    bioOccupation: {
      color: theme.textSecondary,
      fontSize: Typography.body.fontSize,
    },
  });

export default UserProfileBio;
