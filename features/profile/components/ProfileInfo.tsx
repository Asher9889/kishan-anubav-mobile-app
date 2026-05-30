import { memo, useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { MapPin } from 'lucide-react-native';

import { Colors, Spacing, Typography } from '@/constants/theme';
import type { AuthUser } from '@/features/auth/types/user';

type AppTheme = typeof Colors.light;

type ProfileInfoProps = {
  theme: AppTheme;
  user: AuthUser | null;
  fullName: string;
  username: string | null | undefined;
  location: string | null | undefined;
  isProfileCompleted: boolean;
};

const ProfileInfoComponent = ({ theme, user, fullName, username, location, isProfileCompleted }: ProfileInfoProps) => {
  const styles = useMemo(() => createStyles(theme), [theme]);

  if (!isProfileCompleted) {
    return (
      <View style={styles.container}>
        <Text style={styles.incomplete}>Profile not completed</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.bioLine} numberOfLines={3}>
        {user?.bio?.trim() || 'Farmer sharing updates from the field.'}
      </Text>

      {location ? (
        <View style={styles.locationRow}>
          <MapPin size={12} color={theme.textMuted} strokeWidth={1.8} />
          <Text style={styles.bioLine} numberOfLines={2}>
          {location}
          </Text>
        </View>
      ) : null}

      {user?.role ? (
        <Text style={styles.bioLine} numberOfLines={2}>
          🌾 {user.role}
        </Text>
      ) : null}

      <Text style={styles.bioLine} numberOfLines={2}>
        Sharing crop progress, harvest updates, and daily farming notes.
      </Text>
    </View>
  );
};

export const ProfileInfo = memo(ProfileInfoComponent);

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      paddingHorizontal: Spacing.lg,
      paddingTop: 0,
      paddingBottom: Spacing.sm,
      gap: 4,
    },
    bioLine: {
      color: theme.textMuted,
      fontSize: Typography.body.fontSize,
      lineHeight: Typography.body.lineHeight,
      fontWeight: '500',
    },
    locationRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: 6,
    },
    incomplete: {
      color: theme.textMuted,
      fontSize: Typography.body.fontSize,
      fontWeight: '600',
    },
  });
