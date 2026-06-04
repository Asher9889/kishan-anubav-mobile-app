// app/knowledge/create.tsx
import useTheme from '@/hooks/useTheme'; // Your hook
import { useRouter } from 'expo-router';
import React, { useCallback } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FormSection } from '../components/FormSection';
import { HeaderSection } from '../components/HeaderSection';
import ImagePickerSheet from '../components/ImagePickerSheet';
import { ImageSection } from '../components/ImageSection';
import { useCreatePost } from '../hooks/useCreatePost';
import { PostFormData } from '../types/knowledge.types';

// ─── Constants ─────────────────────────────────────────

const MAX_IMAGES = 5;
const MAX_TITLE_LENGTH = 100;
const MAX_DESCRIPTION_LENGTH = 2000;

// ─── Mock API ──────────────────────────────────────────

const submitPost = async (data: PostFormData): Promise<void> => {
  // Replace with your actual API call
  console.log('Submitting post:', data);
  await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network
};

export default function CreateKnowledgeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors, typography, isDark } = useTheme();

  const {
    // State
    title,
    setTitle,
    description,
    setDescription,
    images,
    isSubmitting,
    showPickerSheet,
    setShowPickerSheet,
    errors,
    isValid,

    // Actions
    pickImage,
    removeImage,
    submit,
    reset,
  } = useCreatePost(MAX_IMAGES, MAX_TITLE_LENGTH, MAX_DESCRIPTION_LENGTH);

  const handleBack = useCallback(() => {
    if (title || description || images.length > 0) {
      Alert.alert(
        'Discard Post?',
        'You have unsaved changes. Are you sure you want to leave?',
        [
          { text: 'Keep Editing', style: 'cancel' },
          {
            text: 'Discard',
            style: 'destructive',
            onPress: () => {
              reset();
              router.back();
            }
          },
        ]
      );
    } else {
      router.back();
    }
  }, [title, description, images, reset, router]);

  const handlePost = useCallback(async () => {
    await submit(async (data) => {
      await submitPost(data);
      Alert.alert('Success', 'Your knowledge post has been shared!', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    });
  }, [submit, router]);

  return (
    <View style={{ flex: 1 }}>

      <View style={{ flex: 1, backgroundColor: colors.background, paddingTop: insets.top }}>

        <KeyboardAvoidingView
          style={[styles.screen, { backgroundColor: colors.background }]}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
        >
          {/* Header */}
          <HeaderSection
            onBack={handleBack}
            onPost={handlePost}
            canPost={isValid && !isSubmitting}
            isSubmitting={isSubmitting}
            colors={colors}
            isDark={isDark}
          />

          {/* Form Content */}
          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={styles.scrollContent}
          >
            <FormSection
              title={title}
              onTitleChange={setTitle}
              description={description}
              onDescriptionChange={setDescription}
              titleError={errors.title}
              descriptionError={errors.description}
              maxTitleLength={MAX_TITLE_LENGTH}
              maxDescriptionLength={MAX_DESCRIPTION_LENGTH}
              colors={colors}
              typography={typography}
            />

            <ImageSection
              images={images}
              maxImages={MAX_IMAGES}
              onAddPress={() => setShowPickerSheet(true)}
              onRemove={removeImage}
              colors={colors}
              typography={typography}
            />

            {/* Bottom spacing */}
            <View style={{ height: 40 }} />
          </ScrollView>

          {/* Image Picker Bottom Sheet */}
        </KeyboardAvoidingView>
        {showPickerSheet &&
          <View style={{ flex: 1 }}>

            <ImagePickerSheet
              visible={showPickerSheet}
              onClose={() => setShowPickerSheet(false)}
              onSelect={pickImage}
              colors={colors}
            />
          </View>
        }
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
});