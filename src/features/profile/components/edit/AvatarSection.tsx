import React, { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { Camera } from 'lucide-react-native';
import { Colors, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

type AppTheme = typeof Colors.light;

interface AvatarSectionProps {
  avatarUri: string;
  onPickAvatar: () => void;
}

const AvatarSection = ({ avatarUri, onPickAvatar }: AvatarSectionProps) => {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'] as AppTheme;
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <View style={styles.avatarSection}>
      <Pressable onPress={onPickAvatar} style={styles.avatarButton} accessibilityRole="button">
        {avatarUri ? (
          <Image source={{ uri: avatarUri }} style={styles.avatarImage} contentFit="cover" />
        ) : (
          <View style={styles.avatarFallback}>
            <Camera size={28} color={theme.textMuted} strokeWidth={2} />
          </View>
        )}
      </Pressable>
      <Pressable onPress={onPickAvatar} style={styles.changeAvatarButton}>
        <Text style={styles.changeAvatarText}>Change profile photo</Text>
      </Pressable>
    </View>
  );
};

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    avatarSection: {
      alignItems: 'center',
      paddingVertical: Spacing.xl,
      backgroundColor: theme.background,
    },
    avatarButton: {
      width: 100,
      height: 100,
      borderRadius: 50,
      backgroundColor: theme.surfaceContainerLow,
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: theme.borderLight,
    },
    avatarImage: {
      width: '100%',
      height: '100%',
    },
    avatarFallback: {
      width: '100%',
      height: '100%',
      alignItems: 'center',
      justifyContent: 'center',
    },
    changeAvatarButton: {
      marginTop: Spacing.sm,
      paddingVertical: Spacing.xs,
      paddingHorizontal: Spacing.md,
    },
    changeAvatarText: {
      color: theme.primary,
      fontSize: 15,
      fontWeight: '600',
    },
  });

export default AvatarSection;
