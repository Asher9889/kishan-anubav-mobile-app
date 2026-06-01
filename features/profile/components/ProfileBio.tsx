import React, { useMemo } from 'react';
import { StyleSheet, Text, View, Pressable, Linking } from 'react-native';
import { Link as LinkIcon } from 'lucide-react-native';
import { Colors, Spacing, Typography } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import type { ProfileFormState } from '../hooks/useProfileForm';

type AppTheme = typeof Colors.light;

interface ProfileBioProps {
  profile: ProfileFormState;
}

const ProfileBio = ({ profile }: ProfileBioProps) => {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'] as AppTheme;
  const styles = useMemo(() => createStyles(theme), [theme]);

  const displayName = profile.fullName.trim() || profile.username.trim() || 'Your Name';
  const displayBio = profile.bio.trim() || 'A Man with Ambition';
  const displayWebsite = profile.website.trim() || 'saurabhkushwaha.in';

  return (
    <View style={styles.bioSection}>
      <Text style={styles.bioName}>{displayName}</Text>
      <Text style={styles.bioText}>{displayBio}</Text>
      {profile.occupation ? (
        <Text style={styles.bioOccupation}>{profile.occupation}</Text>
      ) : null}
      <Pressable
        onPress={() => Linking.openURL(`https://${displayWebsite}`)}
        style={styles.bioLink}
      >
        <LinkIcon size={14} color={theme.primary} />
        <Text style={styles.bioLinkText}>{displayWebsite}</Text>
      </Pressable>
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
