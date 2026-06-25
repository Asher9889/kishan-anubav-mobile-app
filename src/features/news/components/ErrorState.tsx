// components/news-detail/loaders/ErrorState.tsx
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

interface ErrorStateProps {
  message: string;
  onRetry: () => void;
  primaryColor: string;
  onPrimaryColor: string;
  textColor: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  message,
  onRetry,
  primaryColor,
  onPrimaryColor,
  textColor,
}) => (
  <View style={styles.container}>
    <Text style={[styles.message, { color: textColor }]}>{message}</Text>
    <Pressable
      onPress={onRetry}
      style={[styles.button, { backgroundColor: primaryColor }]}
    >
      <Text style={[styles.buttonText, { color: onPrimaryColor }]}>Try Again</Text>
    </Pressable>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  message: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },
  button: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '700',
  },
});