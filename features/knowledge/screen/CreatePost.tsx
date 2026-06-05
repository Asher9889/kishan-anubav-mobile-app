// app/knowledge/create.tsx
import { useAuthStore } from '@/features/auth/store/auth.store';
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
import { usePostKnowledge } from '../hooks/usePostKnowledge';
import { PostKnowledgeApiDTO } from '../types/knowledge.types';

// ─── Constants ─────────────────────────────────────────

const MAX_IMAGES = 5;
const MAX_TITLE_LENGTH = 100;
const MAX_DESCRIPTION_LENGTH = 2000;

export default function CreateKnowledgeScreen() {
  const userInfo = useAuthStore((state) => state.user);
  const mutateKnowledgePost = usePostKnowledge();
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

  const handlePost = () => {
    const data: PostKnowledgeApiDTO = {
      userinfo: {
        name: userInfo?.fullName || 'Unknown User',
        location: userInfo?.city || 'Unknown Location',
        district: userInfo?.district || 'Unknown District',
        state: userInfo?.state || 'Unknown State',
      },
      knowledge: description.trim(),
      images: images
    };
    console.log("[CreatePost] Submitting knowledge post with data:", data);
    mutateKnowledgePost.mutate(data, {
      onError: (error) => {
        Alert.alert('Error',  error.message ||'Failed to post knowledge. Please try again.');
      },
      onSuccess: () => {
        Alert.alert('Success', 'Your knowledge has been posted!');
        reset();
        router.push("/(private)/(stack)/knowledge/create");
      }
    })

  };

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