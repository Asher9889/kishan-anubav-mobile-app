import { Colors, Spacing, Typography } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { ChevronLeft } from 'lucide-react-native';
import React, { useEffect, useMemo, useRef } from 'react';
import { Controller } from 'react-hook-form';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type {
  EditableProfileTextField,
  ProfileFormControl,
  UseProfileFormReturn,
} from '../../hooks/useProfileForm';

type AppTheme = typeof Colors.light;

type FieldConfig = {
  title: string;
  label: string;
  placeholder: string;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  multiline?: boolean;
  numberOfLines?: number;
};

const FIELD_CONFIG: Record<EditableProfileTextField, FieldConfig> = {
  fullName: {
    title: 'Edit name',
    label: 'Name',
    placeholder: 'Your full name',
    autoCapitalize: 'words',
  },
  username: {
    title: 'Edit username',
    label: 'Username',
    placeholder: 'username',
    autoCapitalize: 'none',
  },
  bio: {
    title: 'Edit bio',
    label: 'Bio',
    placeholder: 'Tell people about yourself',
    multiline: true,
    numberOfLines: 5,
  },
  state: {
    title: 'Edit state',
    label: 'State',
    placeholder: 'State',
    autoCapitalize: 'words',
  },
  city: {
    title: 'Edit city',
    label: 'City',
    placeholder: 'City',
    autoCapitalize: 'words',
  },
  address: {
    title: 'Edit address',
    label: 'Address',
    placeholder: 'Enter address',
    multiline: true,
    numberOfLines: 4,
  },
};

interface FocusedProfileFieldModalProps {
  open: boolean;
  field: EditableProfileTextField | null;
  form: ProfileFormControl;
  usernameAvailability: UseProfileFormReturn['usernameAvailability'];
  isSaving: boolean;
  onSave: (field: EditableProfileTextField) => Promise<boolean>;
  onClose: () => void;
}

const FocusedProfileFieldModal = ({
  open,
  field,
  form,
  usernameAvailability,
  isSaving,
  onSave,
  onClose,
}: FocusedProfileFieldModalProps) => {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'] as AppTheme;
  const styles = useMemo(() => createStyles(theme), [theme]);
  const inputRef = useRef<TextInput>(null);
  const initialValueRef = useRef('');
  const didSaveRef = useRef(false);
  const config = field ? FIELD_CONFIG[field] : null;
  const fieldError = field ? form.formState.errors[field]?.message : undefined;
  const helperText =
    typeof fieldError === 'string'
      ? fieldError
      : field === 'username'
        ? usernameAvailability.message
        : '';
  const helperTone =
    fieldError || usernameAvailability.state === 'unavailable' || usernameAvailability.state === 'error'
      ? 'error'
      : usernameAvailability.state === 'available'
        ? 'success'
        : 'muted';

  useEffect(() => {
    if (!open || !field) return;

    didSaveRef.current = false;
    initialValueRef.current = String(form.getValues(field) ?? '');

    const timeoutId = setTimeout(() => {
      inputRef.current?.focus();
    }, 250);

    return () => clearTimeout(timeoutId);
  }, [field, form, open]);

  const handleClose = () => {
    if (field && !didSaveRef.current) {
      form.setValue(field, initialValueRef.current, {
        shouldDirty: false,
        shouldTouch: false,
        shouldValidate: false,
      });
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
      <SafeAreaView style={styles.safeArea} edges={['top', "left", "right", "bottom"]}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.flex}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
        >
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

              <View style={styles.content}>
                <Text style={styles.fieldLabel}>{config.label}</Text>
                <Controller
                  key={field}
                  control={form.control}
                  name={field}
                  render={({ field: { value, onChange, onBlur } }) => (
                    <TextInput
                      ref={inputRef}
                      value={typeof value === 'string' ? value : ''}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      placeholder={config.placeholder}
                      placeholderTextColor={theme.textMuted}
                      style={[styles.input, config.multiline && styles.inputMultiline]}
                      multiline={config.multiline}
                      numberOfLines={config.numberOfLines}
                      autoCapitalize={config.autoCapitalize ?? 'sentences'}
                      autoCorrect={field !== 'username'}
                      textAlignVertical={config.multiline ? 'top' : 'center'}
                    />
                  )}
                />
                {helperText ? (
                  <Text
                    style={[
                      styles.helperText,
                      helperTone === 'success' && styles.helperTextSuccess,
                      helperTone === 'error' && styles.helperTextError,
                    ]}
                  >
                    {helperText}
                  </Text>
                ) : null}
              </View>
            </>
          ) : null}
        </KeyboardAvoidingView>
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
    flex: {
      flex: 1,
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
      gap: Spacing.sm,
    },
    fieldLabel: {
      color: theme.text,
      fontSize: 15,
      fontWeight: '500',
    },
    input: {
      minHeight: 48,
      color: theme.text,
      fontSize: 16,
      paddingHorizontal: Spacing.md,
      paddingVertical: Platform.OS === 'ios' ? 12 : 8,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: theme.borderLight,
      borderRadius: 8,
      backgroundColor: theme.surfaceContainerLow,
    },
    inputMultiline: {
      minHeight: 120,
    },
    helperText: {
      color: theme.textMuted,
      fontSize: 12,
      lineHeight: 16,
    },
    helperTextSuccess: {
      color: theme.success,
    },
    helperTextError: {
      color: theme.error,
    },
  });

export default FocusedProfileFieldModal;
