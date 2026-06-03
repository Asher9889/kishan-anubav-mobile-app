import { Colors, Spacing, Typography } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Check, ChevronLeft } from 'lucide-react-native';
import React, { useEffect, useMemo, useRef } from 'react';
import { Controller, type PathValue } from 'react-hook-form';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type {
  EditableProfileSelectField,
  ProfileFormControl,
  ProfileFormState,
} from '../../hooks/useProfileForm';
import { GENDER_OPTIONS, OCCUPATIONS } from '../../types/profile.types';

type AppTheme = typeof Colors.light;

type OptionConfig = {
  title: string;
  label: string;
  placeholder: string;
  options: { label: string; value: string }[];
};

const FIELD_CONFIG: Record<EditableProfileSelectField, OptionConfig> = {
  gender: {
    title: 'Edit gender',
    label: 'Gender',
    placeholder: 'Select gender',
    options: GENDER_OPTIONS,
  },
  occupation: {
    title: 'Edit occupation',
    label: 'Occupation',
    placeholder: 'Select occupation',
    options: Object.values(OCCUPATIONS).map((occupation) => ({
      label: occupation,
      value: occupation,
    })),
  },
};

interface FocusedProfileOptionModalProps {
  open: boolean;
  field: EditableProfileSelectField | null;
  form: ProfileFormControl;
  isSaving: boolean;
  onSave: (field: EditableProfileSelectField) => Promise<boolean>;
  onClose: () => void;
}

const FocusedProfileOptionModal = ({
  open,
  field,
  form,
  isSaving,
  onSave,
  onClose,
}: FocusedProfileOptionModalProps) => {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'] as AppTheme;
  const styles = useMemo(() => createStyles(theme), [theme]);
  const initialValueRef = useRef('');
  const didSaveRef = useRef(false);
  const config = field ? FIELD_CONFIG[field] : null;
  const fieldError = field ? form.formState.errors[field]?.message : undefined;

  useEffect(() => {
    if (!open || !field) return;

    didSaveRef.current = false;
    initialValueRef.current = String(form.getValues(field) ?? '');
  }, [field, form, open]);

  const handleClose = () => {
    if (field && !didSaveRef.current) {
      form.setValue(
        field,
        initialValueRef.current as PathValue<ProfileFormState, typeof field>,
        {
          shouldDirty: false,
          shouldTouch: false,
          shouldValidate: false,
        }
      );
      form.clearErrors(field);
    }

    onClose();
  };

  const handleSave = async () => {
    if (!field) return;

    const didSave = await onSave(field);
    if (didSave) {
      didSaveRef.current = true;
      onClose();
    }
  };

  return (
    <Modal
      animationType="slide"
      presentationStyle="formSheet"
      visible={open && Boolean(field && config)}
      onRequestClose={handleClose}
    >
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right', 'bottom']}>
        {field && config ? (
          <>
            <View style={styles.topBar}>
              <Pressable onPress={handleClose} accessibilityRole="button">
                <ChevronLeft size={24} color={theme.text} strokeWidth={2.2} />
              </Pressable>
              <Text style={styles.title}>{config.title}</Text>
              <Pressable
                onPress={handleSave}
                disabled={isSaving}
                accessibilityRole="button"
              >
                <Text style={[styles.saveText, isSaving && styles.saveTextDisabled]}>
                  {isSaving ? 'Saving' : 'Save'}
                </Text>
              </Pressable>
            </View>

            <Controller
              key={field}
              control={form.control}
              name={field}
              render={({ field: { value, onChange } }) => (
                <ScrollView
                  contentContainerStyle={styles.content}
                  showsVerticalScrollIndicator={false}
                >
                  <View style={styles.labelBlock}>
                    <Text style={styles.fieldLabel}>{config.label}</Text>
                    <Text style={styles.placeholder}>{config.placeholder}</Text>
                  </View>

                  {config.options.map((option) => {
                    const active = value === option.value;

                    return (
                      <Pressable
                        key={option.value}
                        onPress={() => onChange(option.value)}
                        style={({ pressed }) => [
                          styles.optionRow,
                          pressed && styles.optionRowPressed,
                          active && styles.optionRowActive,
                        ]}
                        accessibilityRole="button"
                        accessibilityState={{ selected: active }}
                      >
                        <Text
                          style={[
                            styles.optionText,
                            active && styles.optionTextActive,
                          ]}
                        >
                          {option.label}
                        </Text>
                        {active ? (
                          <Check size={20} color={theme.primary} strokeWidth={2.4} />
                        ) : null}
                      </Pressable>
                    );
                  })}

                  {typeof fieldError === 'string' ? (
                    <Text style={styles.errorText}>{fieldError}</Text>
                  ) : null}
                </ScrollView>
              )}
            />
          </>
        ) : null}
      </SafeAreaView>
    </Modal>
  );
};

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: theme.background,
    },
    topBar: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: Spacing.lg,
      paddingVertical: Spacing.md,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: theme.borderLight,
      backgroundColor: theme.background,
    },
    title: {
      color: theme.text,
      fontSize: Typography.h3.fontSize,
      lineHeight: Typography.h3.lineHeight,
      fontWeight: '700',
    },
    saveText: {
      color: theme.primary,
      fontSize: Typography.bodyMedium.fontSize,
      fontWeight: '700',
    },
    saveTextDisabled: {
      color: theme.textMuted,
      opacity: 0.4,
    },
    content: {
      paddingHorizontal: Spacing.lg,
      paddingTop: Spacing.xl,
      paddingBottom: Spacing.xxl,
      gap: Spacing.sm,
    },
    labelBlock: {
      gap: 4,
      paddingBottom: Spacing.xs,
    },
    fieldLabel: {
      color: theme.text,
      fontSize: 15,
      fontWeight: '500',
    },
    placeholder: {
      color: theme.textMuted,
      fontSize: 13,
      lineHeight: 18,
    },
    optionRow: {
      minHeight: 52,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: Spacing.md,
      paddingVertical: 12,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: theme.borderLight,
      borderRadius: 8,
      backgroundColor: theme.surfaceContainerLow,
      gap: Spacing.md,
    },
    optionRowActive: {
      borderColor: theme.primary,
      backgroundColor: theme.primaryMuted,
    },
    optionRowPressed: {
      borderColor: theme.primary,
      backgroundColor: theme.primaryMuted,
    },
    optionText: {
      flex: 1,
      color: theme.text,
      fontSize: Typography.body.fontSize,
      lineHeight: Typography.body.lineHeight,
      fontWeight: Typography.body.fontWeight,
    },
    optionTextActive: {
      color: theme.primaryDark,
      fontWeight: Typography.bodyMedium.fontWeight,
    },
    errorText: {
      color: theme.error,
      fontSize: 12,
      lineHeight: 16,
      paddingTop: Spacing.xs,
    },
  });

export default FocusedProfileOptionModal;
