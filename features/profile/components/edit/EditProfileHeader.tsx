import { Colors, Spacing, Typography } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { ChevronLeft } from 'lucide-react-native';
import React, { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type AppTheme = typeof Colors.light;

interface EditProfileHeaderProps {
  onClose: () => void;
  handleSave: () => void;
  isSaveDisabled: boolean;
  isSaving: boolean;
}

const EditProfileHeader = ({
  onClose,
  handleSave,
  isSaveDisabled,
  isSaving,
}: EditProfileHeaderProps) => {
  const colorScheme = useColorScheme();
  const insets = useSafeAreaInsets();
  const theme = Colors[colorScheme ?? 'light'] as AppTheme;
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <View style={[styles.topBar]}>
      <Pressable onPress={onClose} accessibilityRole="button">
        <ChevronLeft size={24} color={theme.text} strokeWidth={2.2} />
      </Pressable>
      <Text style={styles.title}>Edit profile</Text>
      <Pressable
        onPress={handleSave}
        disabled={isSaveDisabled}
        accessibilityRole="button"
      >
        {isSaving ? (
          <Text style={[styles.saveText, styles.saveTextDisabled]}>Saving</Text>
        ) : (
          <Text style={[styles.saveText, isSaveDisabled && styles.saveTextDisabled]}>Save</Text>
        )}
      </Pressable>
    </View>
  );
};

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    topBar: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: Spacing.lg,
      paddingVertical: Spacing.md,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: theme.borderLight,
      backgroundColor: theme.background,
    },
    title: {
      color: theme.text,
      fontSize: Typography.h3.fontSize,
      lineHeight: Typography.h3.lineHeight,
      fontWeight: '700',
    },
    saveText: {
      color: theme.primary,
      fontSize: Typography.bodyMedium.fontSize,
      fontWeight: '700',
    },
    saveTextDisabled: {
      color: theme.textMuted,
      opacity: 0.4,
    },
  });

export default EditProfileHeader;
