import { Colors, Spacing, Typography } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Check } from 'lucide-react-native';
import React, { useMemo } from 'react';
import { Controller, useWatch } from 'react-hook-form';
import { StyleSheet, Text, View } from 'react-native';
import type {
  EditableProfileSelectField,
  EditableProfileTextField,
  ProfileFormControl,
} from '../../hooks/useProfileForm';
import { GENDER_OPTIONS } from '../../types/profile.types';
import FormField from './FormField';
import SelectField from './SelectField';

type AppTheme = typeof Colors.light;

interface ProfileFormProps {
  form: ProfileFormControl;
  onPressField: (field: EditableProfileTextField) => void;
  onPressSelectField: (field: EditableProfileSelectField) => void;
  locationData: any;
}

const ProfileForm = ({
  form,
  onPressField,
  onPressSelectField,
  locationData,
}: ProfileFormProps) => {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'] as AppTheme;
  const styles = useMemo(() => createStyles(theme), [theme]);
  const { control } = form;
  const selectedOccupation = useWatch({ control, name: 'occupation' });
  const selectedGender = useWatch({ control, name: 'gender' });
  const selectedGenderLabel =
    GENDER_OPTIONS.find((option) => option.value === selectedGender)?.label ?? '';
    
  return (
    <View style={styles.formContainer}>
      <Controller
        control={control}
        name="fullName"
        render={({ field: { value, onChange } }) => (
          <FormField
            label="Name"
            value={value}
            onChangeText={onChange}
            placeholder="Your full name"
            onPress={() => onPressField('fullName')}
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
            onPress={() => onPressField('username')}
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
        render={({ field: { value, onChange } }) => (
          <FormField
            label="Bio"
            value={value}
            onChangeText={onChange}
            placeholder="Tell people about yourself"
            multiline
            numberOfLines={3}
            onPress={() => onPressField('bio')}
          />
        )}
      />

      <SelectField
        label="Occupation"
        value={selectedOccupation}
        placeholder="Select occupation"
        onPress={() => onPressSelectField('occupation')}
      />

      <Controller
        control={control}
        name="state"
        render={({ field: { value, onChange } }) => (
          <FormField
            label="State"
            value={value}
            onChangeText={onChange}
            placeholder={locationData?.region?.trim() || 'State'}
            onPress={() => onPressField('state')}
          />
        )}
      />
      <Controller
        control={control}
        name="city"
        render={({ field: { value, onChange } }) => (
          <FormField
            label="City"
            value={value}
            onChangeText={onChange}
            placeholder={locationData?.city?.trim() || 'City'}
            onPress={() => onPressField('city')}
          />
        )}
      />
      <Controller
        control={control}
        name="address"
        render={({ field: { value, onChange } }) => (
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
            onPress={() => onPressField('address')}
          />
        )}
      />

      <SelectField
        label="Gender"
        value={selectedGenderLabel}
        placeholder="Select gender"
        onPress={() => onPressSelectField('gender')}
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
