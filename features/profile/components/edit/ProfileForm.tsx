import { Colors, Radius, Spacing, Typography } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Check } from 'lucide-react-native';
import React, { useMemo } from 'react';
import { Controller, useWatch } from 'react-hook-form';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { ProfileFormControl, UseProfileFormReturn } from '../../hooks/useProfileForm';
import { GENDER_OPTIONS } from '../../types/profile.types';
import FormField from './FormField';
import SelectField from './SelectField';

type AppTheme = typeof Colors.light;

interface ProfileFormProps {
  form: ProfileFormControl;
  usernameAvailability: UseProfileFormReturn['usernameAvailability'];
  onPressOccupation: () => void;
  locationData: any;
}

const ProfileForm = ({
  form,
  usernameAvailability,
  onPressOccupation,
  locationData,
}: ProfileFormProps) => {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'] as AppTheme;
  const styles = useMemo(() => createStyles(theme), [theme]);
  const { control, formState } = form;
  const selectedOccupation = useWatch({ control, name: 'occupation' });
  const usernameError = formState.errors.username?.message;
  const usernameHelper =
    usernameError ?? usernameAvailability.message;
  const usernameHelperTone = usernameError
    ? 'error'
    : usernameAvailability.state === 'available'
      ? 'success'
      : usernameAvailability.state === 'unavailable' || usernameAvailability.state === 'error'
        ? 'error'
        : 'muted';

  return (
    <View style={styles.formContainer}>
      <Controller
        control={control}
        name="fullName"
        render={({ field: { value, onChange }, fieldState: { error } }) => (
          <FormField
            label="Name"
            value={value}
            onChangeText={onChange}
            placeholder="Your full name"
            helperText={error?.message}
            helperTone="error"
          />
        )}
      />
      <Controller
        control={control}
        name="username"
        render={({ field: { value, onChange } }) => (
          <FormField
            label="Username"
            value={value}
            onChangeText={onChange}
            placeholder="username"
            autoCapitalize="none"
            helperText={usernameHelper}
            helperTone={usernameHelperTone}
          />
        )}
      />
      {/* <Controller
        control={control}
        name="website"
        render={({ field: { value, onChange }, fieldState: { error } }) => (
          <FormField
            label="Website"
            value={value}
            onChangeText={onChange}
            placeholder="Website"
            autoCapitalize="none"
            helperText={error?.message}
            helperTone="error"
          />
        )}
      /> */}
      <Controller
        control={control}
        name="bio"
        render={({ field: { value, onChange }, fieldState: { error } }) => (
          <FormField
            label="Bio"
            value={value}
            onChangeText={onChange}
            placeholder="Tell people about yourself"
            multiline
            numberOfLines={3}
            helperText={error?.message}
            helperTone="error"
          />
        )}
      />

      <SelectField
        label="Occupation"
        value={selectedOccupation}
        placeholder="Select occupation"
        onPress={onPressOccupation}
      />

      <Controller
        control={control}
        name="state"
        render={({ field: { value, onChange }, fieldState: { error } }) => (
          <FormField
            label="State"
            value={value}
            onChangeText={onChange}
            placeholder={locationData?.region?.trim() || 'State'}
            helperText={error?.message}
            helperTone="error"
          />
        )}
      />
      <Controller
        control={control}
        name="city"
        render={({ field: { value, onChange }, fieldState: { error } }) => (
          <FormField
            label="City"
            value={value}
            onChangeText={onChange}
            placeholder={locationData?.city?.trim() || 'City'}
            helperText={error?.message}
            helperTone="error"
          />
        )}
      />
      <Controller
        control={control}
        name="address"
        render={({ field: { value, onChange }, fieldState: { error } }) => (
          <FormField
            label="Address"
            value={value}
            onChangeText={onChange}
            placeholder={
              [locationData?.street, locationData?.district, locationData?.subregion]
                .map((p: any) => p?.trim())
                .filter(Boolean)
                .join(', ') || 'Enter address'
            }
            multiline
            numberOfLines={2}
            helperText={error?.message}
            helperTone="error"
          />
        )}
      />

      <Controller
        control={control}
        name="gender"
        render={({ field: { value, onChange }, fieldState: { error } }) => (
          <>
            <View style={styles.genderRowContainer}>
              <Text style={styles.fieldLabel}>Gender</Text>
              <View style={styles.genderChipsContainer}>
                {GENDER_OPTIONS.map((option) => {
                  const active = value === option.value;
                  return (
                    <Pressable
                      key={option.value}
                      onPress={() => onChange(option.value)}
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
            {error?.message ? (
              <Text style={styles.errorText}>{error.message}</Text>
            ) : null}
          </>
        )}
      />

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
    errorText: {
      color: theme.error,
      fontSize: Typography.small.fontSize,
      lineHeight: Typography.small.lineHeight,
      marginTop: Spacing.xs,
      marginLeft: 100,
    },
  });

export default ProfileForm;
