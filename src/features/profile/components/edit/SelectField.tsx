import React, { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View, Platform } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { Colors, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

type AppTheme = typeof Colors.light;

interface SelectFieldProps {
  label: string;
  value: string | '' | null;
  placeholder: string;
  onPress: () => void;
}

const SelectField = ({ label, value, placeholder, onPress }: SelectFieldProps) => {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'] as AppTheme;
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <Pressable onPress={onPress} style={styles.fieldRow} accessibilityRole="button">
      <Text style={styles.fieldLabel}>{label}</Text>
      <View style={styles.fieldSelectContainer}>
        <Text
          numberOfLines={1}
          ellipsizeMode="tail"
          style={[styles.fieldInputText, !value && styles.selectPlaceholder]}
        >
          {value || placeholder}
        </Text>
        <ChevronRight size={16} color={theme.textMuted} style={styles.chevronIcon} />
      </View>
    </Pressable>
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
    fieldLabel: {
      width: 100,
      color: theme.text,
      fontSize: 15,
      fontWeight: '500',
    },
    fieldSelectContainer: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    fieldInputText: {
      color: theme.text,
      fontSize: 15,
      flex: 1,
      paddingVertical: Platform.OS === 'ios' ? 8 : 4,
    },
    selectPlaceholder: {
      color: theme.textSecondary,
    },
    chevronIcon: {
      marginLeft: Spacing.xs,
    },
  });

export default SelectField;
