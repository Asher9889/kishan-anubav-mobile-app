import React, { useMemo } from 'react';
import { StyleSheet, Text, TextInput, View, Platform } from 'react-native';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

type AppTheme = typeof Colors.light;

interface FormFieldProps {
  label: string;
  value: string;
  placeholder: string;
  onChangeText: (value: string) => void;
  helperText?: string;
  helperTone?: 'muted' | 'success' | 'error';
  multiline?: boolean;
  numberOfLines?: number;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
}

const FormField = ({
  label,
  value,
  placeholder,
  onChangeText,
  helperText,
  helperTone = 'muted',
  multiline,
  numberOfLines,
  autoCapitalize,
}: FormFieldProps) => {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'] as AppTheme;
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <View style={[styles.fieldRow, multiline && styles.fieldRowMultiline]}>
      <Text style={[styles.fieldLabel, multiline && styles.fieldLabelMultiline]}>{label}</Text>
      <View style={styles.fieldInputContainer}>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={theme.textMuted}
          style={[styles.fieldInput, multiline && styles.fieldInputMultiline]}
          multiline={multiline}
          numberOfLines={numberOfLines}
          autoCapitalize={autoCapitalize ?? 'sentences'}
          textAlignVertical={multiline ? 'top' : 'center'}
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
    </View>
  );
};

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    fieldRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 14,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: theme.borderLight,
    },
    fieldRowMultiline: {
      alignItems: 'flex-start',
    },
    fieldLabel: {
      width: 100,
      color: theme.text,
      fontSize: 15,
      fontWeight: '500',
    },
    fieldLabelMultiline: {
      paddingTop: Platform.OS === 'ios' ? 8 : 4,
    },
    fieldInputContainer: {
      flex: 1,
    },
    fieldInput: {
      color: theme.text,
      fontSize: 15,
      paddingVertical: Platform.OS === 'ios' ? 8 : 4,
      minHeight: 36,
    },
    fieldInputMultiline: {
      minHeight: 60,
      paddingVertical: Platform.OS === 'ios' ? 8 : 4,
    },
    helperText: {
      color: theme.textMuted,
      fontSize: 12,
      lineHeight: 16,
      marginTop: 2,
    },
    helperTextSuccess: {
      color: theme.success,
    },
    helperTextError: {
      color: theme.error,
    },
  });

export default FormField;
