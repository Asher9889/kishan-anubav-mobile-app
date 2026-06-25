import React, { useMemo } from 'react';
import { Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
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
  onPress?: () => void;
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
  onPress,
}: FormFieldProps) => {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'] as AppTheme;
  const styles = useMemo(() => createStyles(theme), [theme]);

  const fieldContent = (
    <>
      <Text style={[styles.fieldLabel, multiline && styles.fieldLabelMultiline]}>{label}</Text>
      <View style={styles.fieldInputContainer}>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          onPressIn={onPress}
          placeholder={placeholder}
          placeholderTextColor={theme.textSecondary}
          style={[styles.fieldInput, multiline && styles.fieldInputMultiline]}
          multiline={multiline}
          numberOfLines={numberOfLines}
          autoCapitalize={autoCapitalize ?? 'sentences'}
          textAlignVertical={multiline ? 'top' : 'center'}
          editable={!onPress}
          showSoftInputOnFocus={!onPress}
          caretHidden={Boolean(onPress)}
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
  );

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        style={[styles.fieldRow, multiline && styles.fieldRowMultiline]}
        accessibilityRole="button"
        accessibilityLabel={`Edit ${label}`}
      >
        {fieldContent}
      </Pressable>
    );
  }

  return (
    <View style={[styles.fieldRow, multiline && styles.fieldRowMultiline]}>
      {fieldContent}
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
      color: theme.textSecondary,
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
