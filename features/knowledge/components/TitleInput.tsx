import React, { forwardRef } from 'react';
import { StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native';

interface TitleInputProps extends TextInputProps {
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
  maxLength: number;
  colors: any;
  typography: any;
}

export const TitleInput = forwardRef<TextInput, TitleInputProps>(({
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
        Title
      </Text>
      <TextInput
        ref={ref}
        value={value}
        onChangeText={onChangeText}
        placeholder="अपना कृषि प्रश्न लिखे..."
        placeholderTextColor={colors.textMuted}
        maxLength={maxLength}
        style={[
          styles.input,
          {
            color: colors.text,
            backgroundColor: colors.surfaceContainerLow,
            borderColor: error ? colors.error : value.length > 0 ? colors.primary : colors.borderLight,
            ...typography.h3,
          },
        ]}
        returnKeyType="next"
        autoFocus
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
          { color: length > maxLength * 0.8 ? colors.warning : colors.textMuted }
        ]}>
          {length}/{maxLength}
        </Text>
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
  input: {
    paddingHorizontal: 16,
    paddingVertical: 18,
    borderRadius: 16,
    borderWidth: 1.5,
    fontSize: 18,
    lineHeight: 24,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
    paddingHorizontal: 4,
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