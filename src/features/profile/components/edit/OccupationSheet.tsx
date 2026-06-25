import React, { useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Colors, Radius, Spacing, Typography } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { OCCUPATIONS, type TOccupation } from '../../types/profile.types';

type AppTheme = typeof Colors.light;

interface OccupationSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  value: TOccupation | '';
  onSelect: (occupation: TOccupation) => void;
}

const OccupationSheet = ({ open, onOpenChange, value, onSelect }: OccupationSheetProps) => {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'] as AppTheme;
  const insets = useSafeAreaInsets();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <Sheet open={open} onOpenChange={onOpenChange} side="right">
      <SheetContent style={[styles.sheetContent, { paddingBottom: 12 }]}>
        <SheetHeader style={[styles.sheetHeader, { marginTop: insets.top }]}>
          <SheetTitle>Select occupation</SheetTitle>
          <SheetDescription>Choose the occupation that best describes you.</SheetDescription>
        </SheetHeader>
        <ScrollView contentContainerStyle={styles.sheetScroll} showsVerticalScrollIndicator={false}>
          {Object.values(OCCUPATIONS).map((item, index) => {
            const isActive = item === value;
            return (
              <Pressable
                key={`${item}-${index}`}
                onPress={() => {
                  onSelect(item as TOccupation);
                }}
                android_ripple={{ color: theme.primaryLight }}
                style={({ pressed }) => [
                  styles.sheetItem,
                  pressed && styles.sheetItemPressed,
                  isActive && styles.sheetItemActive,
                ]}
              >
                <Text style={[styles.sheetItemText, isActive && styles.sheetItemTextActive]}>
                  {item}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </SheetContent>
    </Sheet>
  );
};

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    sheetHeader: {
      paddingTop: Platform.OS === 'ios' ? 28 : 20,
      paddingHorizontal: Spacing.lg,
      paddingBottom: Spacing.md,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: theme.borderLight,
      backgroundColor: theme.surfaceContainerLowest,
    },
    sheetScroll: {
      paddingBottom: Spacing.xl,
      paddingHorizontal: Spacing.lg,
      paddingTop: Spacing.md,
      gap: Spacing.sm,
    },
    sheetContent: {
      width: '88%',
      maxWidth: 420,
      backgroundColor: theme.surfaceContainerLowest,
      borderLeftWidth: 1,
      borderLeftColor: theme.border,
      borderTopLeftRadius: Radius.xl,
      borderBottomLeftRadius: Radius.xl,
      overflow: 'hidden',
    },
    sheetItem: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      minHeight: 54,
      paddingVertical: 14,
      paddingHorizontal: Spacing.lg,
      borderWidth: 1,
      borderColor: theme.borderLight,
      borderRadius: Radius.lg,
      backgroundColor: theme.surfaceContainerLow,
    },
    sheetItemActive: {
      borderColor: theme.primary,
      borderRadius: Radius.lg,
    },
    sheetItemPressed: {
      backgroundColor: theme.primaryMuted,
      borderColor: theme.primary,
    },
    sheetItemText: {
      color: theme.text,
      fontSize: Typography.body.fontSize,
      fontWeight: Typography.body.fontWeight,
    },
    sheetItemTextActive: {
      color: theme.primaryDark,
      borderRadius: Radius.sm,
      fontWeight: Typography.bodyMedium.fontWeight,
    },
  });

export default OccupationSheet;
