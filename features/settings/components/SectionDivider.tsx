// components/settings/SectionDivider.tsx
import React from 'react';
import { StyleSheet, View } from 'react-native';

export default function SectionDivider() {
  return <View style={styles.divider} />;
}

const styles = StyleSheet.create({
  divider: {
    height: 8,
    backgroundColor: '#F2F2F7',
  },
});