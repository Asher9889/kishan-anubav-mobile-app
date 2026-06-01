import React, { useMemo } from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { Check } from 'lucide-react-native';
import { Colors, Radius, Spacing, Typography } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { GENDER_OPTIONS } from '../../types/profile.types';
import type { ProfileFormState } from '../../hooks/useProfileForm';
import FormField from './FormField';
import SelectField from './SelectField';

type AppTheme = typeof Colors.light;

interface ProfileFormProps {
  profile: ProfileFormState;
  updateField: <K extends keyof ProfileFormState>(field: K, value: ProfileFormState[K]) => void;
  onPressOccupation: () => void;
  locationData: any;
}

const ProfileForm = ({
  profile,
  updateField,
  onPressOccupation,
  locationData,
}: ProfileFormProps) => {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'] as AppTheme;
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <View style={styles.formContainer}>
      <FormField
        label="Name"
        value={profile.fullName}
        onChangeText={(v) => updateField('fullName', v)}
        placeholder="Your full name"
      />
      <FormField
        label="Username"
        value={profile.username}
        onChangeText={(v) => updateField('username', v)}
        placeholder="username"
        autoCapitalize="none"
      />
      <FormField
        label="Website"
        value={profile.website}
        onChangeText={(v) => updateField('website', v)}
        placeholder="Website"
        autoCapitalize="none"
      />
      <FormField
        label="Bio"
        value={profile.bio}
        onChangeText={(v) => updateField('bio', v)}
        placeholder="Tell people about yourself"
        multiline
        numberOfLines={3}
      />

      <SelectField
        label="Occupation"
        value={profile.occupation}
        placeholder="Select occupation"
        onPress={onPressOccupation}
      />

      <FormField
        label="State"
        value={profile.state}
        onChangeText={(v) => updateField('state', v)}
        placeholder={locationData?.region?.trim() || 'State'}
      />
      <FormField
        label="City"
        value={profile.city}
        onChangeText={(v) => updateField('city', v)}
        placeholder={locationData?.city?.trim() || 'City'}
      />
      <FormField
        label="Address"
        value={profile.address}
        onChangeText={(v) => updateField('address', v)}
        placeholder={
          [locationData?.street, locationData?.district, locationData?.subregion]
            .map((p: any) => p?.trim())
            .filter(Boolean)
            .join(', ') || 'Enter address'
        }
        multiline
        numberOfLines={2}
      />

      {/* ── Gender Selection ── */}
      <View style={styles.genderRowContainer}>
        <Text style={styles.fieldLabel}>Gender</Text>
        <View style={styles.genderChipsContainer}>
          {GENDER_OPTIONS.map((option) => {
            const active = option.value === profile.gender;
            return (
              <Pressable
                key={option.value}
                onPress={() => updateField('gender', option.value)}
                style={[
                  styles.genderChip,
                  active ? styles.genderChipActive : styles.genderChipInactive,
                ]}
                accessibilityRole="button"
                accessibilityState={{ selected: active }}
              >
                <Text
                  style={[
                    styles.genderChipText,
                    active ? styles.genderChipTextActive : styles.genderChipTextInactive,
                  ]}
                >
                  {option.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <View style={styles.helperBlock}>
        <Check size={14} color={theme.textMuted} strokeWidth={2} />
        <Text style={styles.helperText}>
          This profile appears on your public profile and can be updated anytime.
        </Text>
      </View>
    </View>
  );
};

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    formContainer: {
      backgroundColor: theme.background,
      paddingHorizontal: Spacing.lg,
    },
    fieldLabel: {
      width: 100,
      color: theme.text,
      fontSize: 15,
      fontWeight: '500',
    },
    genderRowContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 14,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: theme.borderLight,
    },
    genderChipsContainer: {
      flex: 1,
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: Spacing.xs,
    },
    genderChip: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: Radius.lg,
      borderWidth: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    genderChipActive: {
      backgroundColor: theme.primary,
      borderColor: theme.primary,
    },
    genderChipInactive: {
      backgroundColor: 'transparent',
      borderColor: theme.borderLight,
    },
    genderChipText: {
      fontSize: 13,
      fontWeight: '600',
    },
    genderChipTextActive: {
      color: theme.onPrimary,
    },
    genderChipTextInactive: {
      color: theme.textSecondary,
    },
    helperBlock: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: 8,
      paddingTop: Spacing.lg,
      paddingBottom: Spacing.xl,
    },
    helperText: {
      flex: 1,
      color: theme.textMuted,
      fontSize: Typography.small.fontSize,
      lineHeight: Typography.small.lineHeight,
      fontWeight: '400',
    },
  });

export default ProfileForm;
