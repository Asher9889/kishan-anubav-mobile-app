// components/settings/SettingItem.tsx
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type IconName = React.ComponentProps<typeof Ionicons>['name'];

interface SettingItemProps {
  icon: IconName;
  label: string;
  onPress: () => void;
  showChevron?: boolean;
  destructive?: boolean;
}

export default function SettingItem({
  icon,
  label,
  onPress,
  showChevron = true,
  destructive = false,
}: SettingItemProps) {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.left}>
        <Ionicons
          name={icon}
          size={22}
          color={destructive ? '#FF3B30' : '#007AFF'}
          style={styles.icon}
        />
        <Text style={[styles.label, destructive && styles.destructiveText]}>
          {label}
        </Text>
      </View>
      {showChevron && (
        <Ionicons name="chevron-forward" size={18} color="#C7C7CC" />
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 12,
    width: 24,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    color: '#000',
  },
  destructiveText: {
    color: '#FF3B30',
  },
});