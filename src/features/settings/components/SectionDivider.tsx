import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function SectionDivider() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const theme = isDark ? Colors.dark : Colors.light;

  return <View style={[styles.divider, { backgroundColor: theme.background }]} />;
}

const styles = StyleSheet.create({
  divider: {
    height: 8,
  },
});