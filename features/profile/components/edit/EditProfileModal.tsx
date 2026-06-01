import React, { useMemo } from 'react';
import { Modal, KeyboardAvoidingView, ScrollView, StyleSheet, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import type { UseProfileFormReturn } from '../../hooks/useProfileForm';
import EditProfileHeader from './EditProfileHeader';
import AvatarSection from './AvatarSection';
import ProfileForm from './ProfileForm';
import OccupationSheet from './OccupationSheet';

type AppTheme = typeof Colors.light;

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profileForm: UseProfileFormReturn;
}

const EditProfileModal = ({ isOpen, onClose, profileForm }: EditProfileModalProps) => {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'] as AppTheme;
  const styles = useMemo(() => createStyles(theme), [theme]);

  const {
    profile,
    updateField,
    isSaving,
    isSaveDisabled,
    handleSave,
    occupationSheetOpen,
    setOccupationSheetOpen,
    onPickAvatar,
    locationData,
  } = profileForm;

  return (
    <Modal
      animationType="slide"
      presentationStyle="fullScreen"
      visible={isOpen}
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.flex}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
        >
          <EditProfileHeader
            onClose={onClose}
            handleSave={handleSave}
            isSaveDisabled={isSaveDisabled}
            isSaving={isSaving}
          />

          <ScrollView
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <AvatarSection
              avatarUri={profile.avatarUri}
              onPickAvatar={onPickAvatar}
            />

            <ProfileForm
              profile={profile}
              updateField={updateField}
              onPressOccupation={() => setOccupationSheetOpen(true)}
              locationData={locationData}
            />
          </ScrollView>

          <OccupationSheet
            open={occupationSheetOpen}
            onOpenChange={setOccupationSheetOpen}
            value={profile.occupation}
            onSelect={(occ) => {
              updateField('occupation', occ);
              setOccupationSheetOpen(false);
            }}
          />
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
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
    content: {
      paddingBottom: Spacing.xxl,
    },
  });

export default EditProfileModal;
