import { Colors, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import React, { useMemo, useState } from 'react';
import { KeyboardAvoidingView, Modal, Platform, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type {
  EditableProfileSelectField,
  EditableProfileTextField,
  UseProfileFormReturn,
} from '../../hooks/useProfileForm';
import AvatarSection from './AvatarSection';
import EditProfileHeader from './EditProfileHeader';
import FocusedProfileFieldModal from './FocusedProfileFieldModal';
import FocusedProfileOptionModal from './FocusedProfileOptionModal';
import ProfileForm from './ProfileForm';

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
  const [focusedField, setFocusedField] = useState<EditableProfileTextField | null>(null);
  const [focusedSelectField, setFocusedSelectField] =
    useState<EditableProfileSelectField | null>(null);

  const {
    profile,
    form,
    usernameAvailability,
    isSaving,
    isFocusedFieldSaving,
    isSaveDisabled,
    handleSave,
    saveFocusedField,
    onPickAvatar,
    locationData,
  } = profileForm;

  const handleClose = () => {
    setFocusedField(null);
    setFocusedSelectField(null);
    onClose();
  };

  return (
    <Modal
      animationType="slide"
      presentationStyle="fullScreen"
      visible={isOpen}
      onRequestClose={handleClose}
    >
      <SafeAreaView style={[styles.safeArea]} edges={['top']}>

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.flex}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
        >
          {/* <View style={{marginTop: insets.top}}> */}

          <EditProfileHeader
            onClose={handleClose}
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
              form={form}
              onPressField={setFocusedField}
              onPressSelectField={setFocusedSelectField}
              locationData={locationData}
            />
          </ScrollView>

          <FocusedProfileFieldModal
            open={Boolean(focusedField)}
            field={focusedField}
            form={form}
            usernameAvailability={usernameAvailability}
            isSaving={isFocusedFieldSaving}
            onSave={saveFocusedField}
            onClose={() => setFocusedField(null)}
          />
          <FocusedProfileOptionModal
            open={Boolean(focusedSelectField)}
            field={focusedSelectField}
            form={form}
            isSaving={isFocusedFieldSaving}
            onSave={saveFocusedField}
            onClose={() => setFocusedSelectField(null)}
          />
           {/* </View> */}
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
