import { Colors, Spacing, Typography } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View } from 'react-native';
import type { ProfileFormState } from '../hooks/useProfileForm';

type AppTheme = typeof Colors.light;

interface ProfileBioProps {
  profile: ProfileFormState;
}

const ProfileBio = ({ profile }: ProfileBioProps) => {
  console.log('ProfileBio profile:', profile); // Debugging line
  const { t } = useTranslation('profile');
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'] as AppTheme;
  const styles = useMemo(() => createStyles(theme), [theme]);

  const displayBio = profile.bio.trim() !== "" ? profile.bio : null;
  return (
    <View style={styles.bioSection}>
      {displayBio ? (
        <Text style={styles.bioText}>{displayBio}</Text>
      ) : (
        <Text style={styles.bioEmpty}>{t('bioEmpty')}</Text>
      )}
      {profile.occupation ? ( 
        <Text style={styles.bioOccupation}>{profile.occupation}</Text>
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
    bioName: {
      color: theme.text,
      fontSize: Typography.bodyMedium.fontSize,
      fontWeight: '600',
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
    bioLink: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      marginTop: 2,
    },
    bioLinkText: {
      color: theme.primary,
      fontSize: Typography.body.fontSize,
      fontWeight: '500',
    },
  });

export default ProfileBio;
