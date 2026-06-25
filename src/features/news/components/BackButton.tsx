import React from 'react';
import { Pressable, StyleSheet } from 'react-native';

interface BackButtonProps {
  onPress: () => void;
  color: string;
  backgroundColor: string;
}

export const BackButton: React.FC<BackButtonProps> = ({
  onPress,
  color,
  backgroundColor,
}) => (
  <Pressable
    onPress={onPress}
    style={[styles.button, { backgroundColor }]}
    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
  >
    <Text style={[styles.icon, { color }]}>←</Text>
  </Pressable>
);

import { Text } from 'react-native';

const styles = StyleSheet.create({
  button: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    fontSize: 20,
    fontWeight: '700',
  },
});