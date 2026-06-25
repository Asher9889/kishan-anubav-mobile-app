// components/news-detail/controls/RenderModeToggle.tsx
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { RenderMode } from '../types/types';

interface RenderModeToggleProps {
  mode: RenderMode;
  onChange: (mode: RenderMode) => void;
  activeColor: string;
  activeTextColor: string;
  inactiveTextColor: string;
  backgroundColor: string;
}

export const RenderModeToggle: React.FC<RenderModeToggleProps> = ({
  mode,
  onChange,
  activeColor,
  activeTextColor,
  inactiveTextColor,
  backgroundColor,
}) => (
  <View style={[styles.container, { backgroundColor }]}>
    <Pressable
      onPress={() => onChange('clean')}
      style={[
        styles.button,
        mode === 'clean' && { backgroundColor: activeColor },
      ]}
    >
      <Text
        style={[
          styles.text,
          { color: mode === 'clean' ? activeTextColor : inactiveTextColor },
        ]}
      >
        Clean Read
      </Text>
    </Pressable>
    <Pressable
      onPress={() => onChange('original')}
      style={[
        styles.button,
        mode === 'original' && { backgroundColor: activeColor },
      ]}
    >
      <Text
        style={[
          styles.text,
          { color: mode === 'original' ? activeTextColor : inactiveTextColor },
        ]}
      >
        Original
      </Text>
    </Pressable>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginTop: 16,
    marginBottom: 8,
    padding: 4,
    borderRadius: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 10,
    alignItems: 'center',
  },
  text: {
    fontSize: 13,
    fontWeight: '600',
  },
});