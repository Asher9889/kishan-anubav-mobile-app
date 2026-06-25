import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

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
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const theme = isDark ? Colors.dark : Colors.light;

  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor: theme.card, borderBottomColor: theme.borderLight }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.left}>
        <Ionicons
          name={icon}
          size={22}
          color={destructive ? theme.error : theme.primary}
          style={styles.icon}
        />
        <Text style={[styles.label, { color: theme.text }, destructive && { color: theme.error }]}>
          {label}
        </Text>
      </View>
      {showChevron && (
        <Ionicons name="chevron-forward" size={18} color={theme.textMuted} />
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
    borderBottomWidth: 1,
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
  },
});