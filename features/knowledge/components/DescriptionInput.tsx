// app/knowledge/_components/inputs/DescriptionInput.tsx
import React, { forwardRef } from 'react';
import { StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native';

interface DescriptionInputProps extends TextInputProps {
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
  maxLength: number;
  colors: any;
  typography: any;
}

export const DescriptionInput = forwardRef<TextInput, DescriptionInputProps>(({
  value,
  onChangeText,
  error,
  maxLength,
  colors,
  typography,
  ...props
}, ref) => {
  const length = value.length;

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: colors.textMuted, ...typography.caption }]}>
        Description
      </Text>
      <View style={[
        styles.inputWrapper,
        {
          backgroundColor: colors.surfaceContainerLow,
          borderColor: error ? colors.error : value.length > 0 ? colors.primary : colors.borderLight,
        },
      ]}>
        <TextInput
          ref={ref}
          value={value}
          onChangeText={onChangeText}
          placeholder="समस्या का समाधान लिखे"
          placeholderTextColor={colors.textMuted}
          maxLength={maxLength}
          multiline
          textAlignVertical="top"
          style={[
            styles.input,
            {
              color: colors.text,
              ...typography.body,
              lineHeight: 24,
            },
          ]}
          {...props}
        />
        <View style={styles.footer}>
          {error ? (
            <Text style={[styles.error, { color: colors.error }]}>{error}</Text>
          ) : (
            <View />
          )}
          <Text style={[
            styles.counter,
            { color: length > maxLength * 0.9 ? colors.warning : colors.textMuted }
          ]}>
            {length}/{maxLength}
          </Text>
        </View>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    marginBottom: 8,
    marginLeft: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  inputWrapper: {
    borderRadius: 16,
    borderWidth: 1.5,
    padding: 16,
    minHeight: 180,
  },
  input: {
    flex: 1,
    minHeight: 140,
    fontSize: 16,
    padding: 0,
    margin: 0,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  error: {
    fontSize: 12,
    fontWeight: '500',
  },
  counter: {
    fontSize: 12,
    fontWeight: '600',
  },
});