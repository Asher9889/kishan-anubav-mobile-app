// app/knowledge/_components/hooks/useCreatePost.ts
import { ImagePickerService } from '@/services/camera.service';
import { useCallback, useRef, useState } from 'react';
import { PickerSource, PostFormData, PostImage } from '../types/knowledge.types';

const generateId = () => Math.random().toString(36).substring(2, 9);

export const useCreatePost = (
  maxImages: number = 5,
  maxTitleLength: number = 100,
  maxDescriptionLength: number = 2000
) => {
  const [title, setTitle] = useState('');   
  const [description, setDescription] = useState('');
  const [images, setImages] = useState<PostImage[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPickerSheet, setShowPickerSheet] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const titleRef = useRef<string>(title);
  const descRef = useRef<string>(description);

  // Validation
  const validate = useCallback((): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!title.trim()) {
      newErrors.title = 'Title is required';
    } else if (title.length > maxTitleLength) {
      newErrors.title = `Title must be under ${maxTitleLength} characters`;
    }

    if (!description.trim()) {
      newErrors.description = 'Description is required';
    } else if (description.length > maxDescriptionLength) {
      newErrors.description = `Description must be under ${maxDescriptionLength} characters`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [title, description, maxTitleLength, maxDescriptionLength]);

  const isValid = title.trim().length > 0 && description.trim().length > 0 && title.length <= maxTitleLength && description.length <= maxDescriptionLength;

  // Image handling
  const pickImage = useCallback(async (source: PickerSource) => {
    setShowPickerSheet(false);
    
    if (images.length >= maxImages) return;

    try {
      const image = source === 'camera'  ? await ImagePickerService.pickFromCamera() : await ImagePickerService.pickFromGallery();
      
      console.log('Picking image from:', source);
      console.log('Picking image:', image);
      // const result = await pickerMethod({
      //   width: 1200,
      //   height: 1200,
      //   cropping: true,
      //   compressImageMaxWidth: 1200,
      //   compressImageMaxHeight: 1200,
      //   compressImageQuality: 0.8,
      //   includeBase64: false,
      //   mediaType: 'photo',
      //   multiple: false,
      //   cropperStatusBarColor: '#8F4E00',
      //   cropperToolbarColor: '#FBF9F4',
      //   cropperToolbarWidgetColor: '#8F4E00',
      //   cropperActiveWidgetColor: '#FF9933',
      // });
      
      if (!image) return;

      const newImage: PostImage = {
        id: generateId(),
        uri: image.uri,
        width: image.width,
        height: image.height,
        mime: image.mimeType || 'image/jpeg',
        size: image.fileSize,
      };

      setImages(prev => [...prev, newImage]);
    } catch (err: any) {
      if (err.code !== 'E_PICKER_CANCELLED') {
        console.error('Image picker error:', err);
      }
    }
  }, [images.length, maxImages]);

  const removeImage = useCallback((id: string) => {
    setImages(prev => prev.filter(img => img.id !== id));
  }, []);

  const reorderImages = useCallback((fromIndex: number, toIndex: number) => {
    setImages(prev => {
      const newImages = [...prev];
      const [moved] = newImages.splice(fromIndex, 1);
      newImages.splice(toIndex, 0, moved);
      return newImages;
    });
  }, []);

  const submit = useCallback(async (onSubmit: (data: PostFormData) => Promise<void>) => {
    if (!validate() || isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      await onSubmit({
        title: title.trim(),
        description: description.trim(),
        images,
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [title, description, images, validate, isSubmitting]);

  const reset = useCallback(() => {
    setTitle('');
    setDescription('');
    setImages([]);
    setErrors({});
    setIsSubmitting(false);
  }, []);

  return {
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
    reorderImages,
    submit,
    reset,
    validate,
  };
};