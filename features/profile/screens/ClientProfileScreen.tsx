import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { Stack, useRouter } from 'expo-router';
import { Camera, Check, ChevronLeft } from 'lucide-react-native';
import { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Linking,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Colors, Radius, Spacing, Typography } from '@/constants/theme';
import { useAuthStore } from '@/features/auth/store/auth.store';
import { useColorScheme } from '@/hooks/use-color-scheme';

import type { AuthUser } from '@/features/auth/types/user';

type AppTheme = typeof Colors.light;

type GenderValue = 'male' | 'female' | 'non-binary' | 'prefer-not-to-say' | '';

const GENDER_OPTIONS: Array<{ label: string; value: GenderValue }> = [
  { label: 'Male', value: 'male' },
  { label: 'Female', value: 'female' },
  { label: 'Non-binary', value: 'non-binary' },
  { label: 'Prefer not to say', value: 'prefer-not-to-say' },
];

const getDisplayName = (user: AuthUser | null) => user?.fullName?.trim() || '';

const ClientProfileScreen = () => {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'] as AppTheme;
  const styles = useMemo(() => createStyles(theme), [theme]);
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);

  const [fullName, setFullName] = useState(getDisplayName(user));
  const [username, setUsername] = useState(user?.username?.trim() ?? '');
  const [bio, setBio] = useState(user?.bio?.trim() ?? '');
  const [gender, setGender] = useState<GenderValue>((user?.gender as GenderValue) ?? '');
  const [avatarUri, setAvatarUri] = useState(user?.avatar?.trim() ?? '');
  const [isSaving, setIsSaving] = useState(false);

  const exitProfile = () => {
    router.replace('/profile');
  };

  useEffect(() => {
    setFullName(getDisplayName(user));
    setUsername(user?.username?.trim() ?? '');
    setBio(user?.bio?.trim() ?? '');
    setGender((user?.gender as GenderValue) ?? '');
    setAvatarUri(user?.avatar?.trim() ?? '');
  }, [user]);

  const onPickAvatar = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      if (permission.canAskAgain) {
        Alert.alert("Permission Required", "Please allow media access.");
      } else {
        Alert.alert("Permission Required", "Please enable media library access in Settings.",
          [
            {
              text: "Cancel",
              style: "cancel",
            },
            {
              text: "Open Settings",
              onPress: () => Linking.openSettings(),
            },
          ]
        );
      }
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images', 'videos'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled && result.assets[0]?.uri) {
      console.log('Selected image URI:', result);
      setAvatarUri(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    if (!user) {
      exitProfile();
      return;
    }

    setIsSaving(true);

    const trimmedFullName = fullName.trim();
    const trimmedUsername = username.trim();
    const trimmedBio = bio.trim();
    const trimmedAvatar = avatarUri.trim();
    const nextUser: AuthUser = {
      ...user,
      fullName: trimmedFullName || null,
      name: trimmedFullName || null,
      username: trimmedUsername || null,
      bio: trimmedBio || null,
      gender: gender || null,
      avatar: trimmedAvatar || null,
      isProfileCompleted: Boolean(trimmedFullName && trimmedUsername && trimmedBio && gender && trimmedAvatar),
    };

    setUser(nextUser);
    setIsSaving(false);
    exitProfile();
  };

  const isSaveDisabled = !fullName.trim() || !username.trim() || !bio.trim() || !gender || !avatarUri.trim() || isSaving;

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={styles.safeArea} edges={["top"]}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.flex}>
          <View style={styles.topBar}>
            <Pressable onPress={exitProfile} accessibilityRole="button" accessibilityLabel="Exit profile">
              <ChevronLeft size={24} color={theme.text} strokeWidth={2.2} />
            </Pressable>

            <Text style={styles.title}>Edit profile</Text>

            <Pressable
              onPress={handleSave}
              disabled={isSaveDisabled}
              accessibilityRole="button"
              accessibilityLabel="Save profile"
            >
              {isSaving ? (
                <Text style={[styles.saveText, styles.saveTextDisabled]}>Saving</Text>
              ) : (
                <Text style={[styles.saveText, isSaveDisabled && styles.saveTextDisabled]}>Save</Text>
              )}
            </Pressable>
          </View>

          <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
            <View style={styles.avatarSection}>
              <Pressable onPress={onPickAvatar} style={styles.avatarButton} accessibilityRole="button" accessibilityLabel="Change profile photo">
                {avatarUri ? (
                  <Image source={{ uri: avatarUri }} style={styles.avatarImage} contentFit="cover" />
                ) : (
                  <View style={styles.avatarFallback}>
                    <Camera size={28} color={theme.textMuted} strokeWidth={2} />
                  </View>
                )}
                <View style={styles.avatarBadge}>
                  <Text style={styles.avatarBadgeText}>Change</Text>
                </View>
              </Pressable>
            </View>

            <View style={styles.section}>
              <Field label="Name" value={fullName} onChangeText={setFullName} placeholder="Your full name" theme={theme} />
              <Field label="Username" value={username} onChangeText={setUsername} placeholder="username" theme={theme} autoCapitalize="none" />
              <Field
                label="Bio"
                value={bio}
                onChangeText={setBio}
                placeholder="Tell people about your farm"
                theme={theme}
                multiline
                numberOfLines={4}
              />
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionLabel}>Gender</Text>
              <View style={styles.genderRow}>
                {GENDER_OPTIONS.map((option) => {
                  const active = option.value === gender;

                  return (
                    <Pressable
                      key={option.value}
                      onPress={() => setGender(option.value)}
                      style={[styles.genderChip, active ? styles.genderChipActive : styles.genderChipInactive]}
                      accessibilityRole="button"
                      accessibilityState={{ selected: active }}
                    >
                      <Text style={[styles.genderChipText, active ? styles.genderChipTextActive : styles.genderChipTextInactive]}>
                        {option.label}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            <View style={styles.helperBlock}>
              <Check size={14} color={theme.textMuted} strokeWidth={2} />
              <Text style={styles.helperText}>This profile appears on your public profile and can be updated anytime.</Text>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </>
  );
};

type FieldProps = {
  theme: AppTheme;
  label: string;
  value: string;
  placeholder: string;
  onChangeText: (value: string) => void;
  multiline?: boolean;
  numberOfLines?: number;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
};

const Field = ({ theme, label, value, placeholder, onChangeText, multiline, numberOfLines, autoCapitalize }: FieldProps) => {
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <View style={styles.fieldBlock}>
      <Text style={styles.sectionLabel}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={theme.textMuted}
        style={[styles.input, multiline && styles.inputMultiline]}
        multiline={multiline}
        numberOfLines={numberOfLines}
        autoCapitalize={autoCapitalize ?? 'sentences'}
        textAlignVertical={multiline ? 'top' : 'center'}
      />
    </View>
  );
};

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: theme.background,
    },
    flex: {
      flex: 1,
    },
    topBar: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: Spacing.lg,
      paddingVertical: Spacing.md,
    },
    title: {
      color: theme.text,
      fontSize: Typography.h3.fontSize,
      lineHeight: Typography.h3.lineHeight,
      fontWeight: '800',
    },
    saveText: {
      color: theme.primary,
      fontSize: Typography.bodyMedium.fontSize,
      fontWeight: '800',
    },
    saveTextDisabled: {
      color: theme.textMuted,
    },
    content: {
      paddingHorizontal: Spacing.lg,
      paddingBottom: Spacing.xxl,
      gap: Spacing.lg,
    },
    avatarSection: {
      alignItems: 'center',
      paddingTop: Spacing.sm,
    },
    avatarButton: {
      width: 120,
      height: 120,
      borderRadius: 120,
      backgroundColor: theme.surfaceContainerLow,
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
    },
    avatarImage: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      width: '100%',
      height: '100%',
    },
    avatarFallback: {
      width: '100%',
      height: '100%',
      alignItems: 'center',
      justifyContent: 'center',
    },
    avatarBadge: {
      position: 'absolute',
      bottom: 8,
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: Radius.full,
      backgroundColor: theme.card,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: theme.borderLight,
    },
    avatarBadgeText: {
      color: theme.text,
      fontSize: 11,
      fontWeight: '700',
    },
    section: {
      gap: Spacing.sm,
    },
    fieldBlock: {
      gap: 8,
    },
    sectionLabel: {
      color: theme.textMuted,
      fontSize: Typography.caption.fontSize,
      lineHeight: Typography.caption.lineHeight,
      fontWeight: '700',
      textTransform: 'uppercase',
      letterSpacing: 0.8,
    },
    input: {
      color: theme.text,
      fontSize: Typography.body.fontSize,
      lineHeight: Typography.body.lineHeight,
      paddingVertical: 12,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: theme.borderLight,
    },
    inputMultiline: {
      minHeight: 96,
      paddingTop: 12,
    },
    genderRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: Spacing.sm,
    },
    genderChip: {
      paddingHorizontal: 14,
      paddingVertical: 10,
      borderRadius: Radius.full,
      borderWidth: StyleSheet.hairlineWidth,
    },
    genderChipActive: {
      backgroundColor: theme.text,
      borderColor: theme.text,
    },
    genderChipInactive: {
      backgroundColor: 'transparent',
      borderColor: theme.borderLight,
    },
    genderChipText: {
      fontSize: Typography.body.fontSize,
      fontWeight: '700',
    },
    genderChipTextActive: {
      color: theme.background,
    },
    genderChipTextInactive: {
      color: theme.text,
    },
    helperBlock: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: 8,
      paddingTop: Spacing.xs,
    },
    helperText: {
      flex: 1,
      color: theme.textMuted,
      fontSize: Typography.small.fontSize,
      lineHeight: Typography.small.lineHeight,
      fontWeight: '500',
    },
  });

export default ClientProfileScreen;
