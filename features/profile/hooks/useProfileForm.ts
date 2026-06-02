import { useAuthStore } from '@/features/auth/store/auth.store';
import type { AuthUser } from '@/features/auth/types/user';
import { useCurrentLocation } from '@/shared/hooks/useCurrentLocation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from '@tanstack/react-query';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useForm, useWatch, type UseFormReturn } from 'react-hook-form';
import { Alert } from 'react-native';
import { checkUsernameAvailability } from '../api/profile.api';
import type { GenderValue, TOccupation } from '../types/profile.types';
import {
  editProfileSchema,
  type EditProfileFormValues,
} from '../validation/edit-profile.schema';
import { useAvatarPicker } from './useAvatarPicker';
import { useAvatarUpload } from './useAvatarUpload';
import useProfileUpdate from './useProfileUpdate';

export type ProfileFormState = EditProfileFormValues;

type UsernameAvailabilityStatus = {
  state: 'idle' | 'checking' | 'available' | 'unavailable' | 'error';
  message: string;
};

export type ProfileFormControl = UseFormReturn<ProfileFormState>;

const USERNAME_PATTERN = /^[a-zA-Z][a-zA-Z0-9_]{2,29}$/;

const DEFAULT_USERNAME_STATUS: UsernameAvailabilityStatus = {
  state: 'idle',
  message: '',
};

type ProfileFormDefaults = {
  fullName: string;
  username: string;
  bio: string;
  gender: GenderValue | '';
  occupation: TOccupation | '';
  state: string;
  city: string;
  address: string;
  avatarUri: string;
  website: string;
};

const createInitialState = (user: AuthUser | null): ProfileFormDefaults => ({
  fullName: user?.fullName?.trim() ?? '',
  username: user?.username?.trim() ?? '',
  bio: user?.bio?.trim() ?? '',
  gender: (user?.gender as GenderValue) ?? '',
  occupation: (user?.occupation as TOccupation) ?? '',
  state: user?.state?.trim() ?? '',
  city: user?.city?.trim() ?? '',
  address: typeof user?.address === 'string' ? user?.address.trim() : '',
  avatarUri: user?.avatar?.trim() ?? '',
  website: '',
});

export const useProfileForm = () => {
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  const { pickAvatar } = useAvatarPicker();

  const shouldFetchLocation = !user?.state?.trim() || !user?.city?.trim() || !user?.address?.trim();
  const { data: locationData } = useCurrentLocation({ enabled: shouldFetchLocation });

  const form = useForm<ProfileFormState>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: createInitialState(user),
    mode: "onChange",
    reValidateMode: 'onChange',
  });

  const profileValues = useWatch({ control: form.control });
  const profile = useMemo(
    () => ({
      ...createInitialState(user),
      ...profileValues,
    }) as ProfileFormState,
    [profileValues, user]
  );

  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [occupationSheetOpen, setOccupationSheetOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'grid' | 'reels' | 'tags'>('grid');
  const [debouncedUsername, setDebouncedUsername] = useState('');

  const updateField = useCallback(<K extends keyof ProfileFormState>(
    field: K,
    value: ProfileFormState[K]
  ) => {
    form.setValue(field as any, value, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
  }, [form]);

  // Sync with user data
  useEffect(() => {
    form.reset(createInitialState(user));
  }, [form, user]);

  // Auto-fill location
  useEffect(() => {
    if (!locationData) return;

    const locationState = locationData.region?.trim() ?? '';
    const locationCity = locationData.city?.trim() ?? '';
    const locationAddress = [
      locationData.street,
      locationData.district,
      locationData.subregion,
    ]
      .map((part) => part?.trim())
      .filter(Boolean)
      .join(', ');

    if (!form.getValues('state')) {
      form.setValue('state', locationState, { shouldValidate: true });
    }
    if (!form.getValues('city')) {
      form.setValue('city', locationCity, { shouldValidate: true });
    }
    if (!form.getValues('address')) {
      form.setValue('address', locationAddress, { shouldValidate: true });
    }
  }, [form, locationData]);

  useEffect(() => {
    const nextUsername = profile.username.trim().toLowerCase();
    const timeoutId = setTimeout(() => {
      setDebouncedUsername(nextUsername);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [profile.username]);

  const currentUsername = user?.username?.trim().toLowerCase() ?? '';
  const shouldCheckUsername =
    Boolean(debouncedUsername) &&
    debouncedUsername !== currentUsername &&
    USERNAME_PATTERN.test(debouncedUsername);

  const usernameAvailabilityQuery = useQuery({
    queryKey: ['profile', 'username-availability', debouncedUsername],
    queryFn: () => checkUsernameAvailability(debouncedUsername),
    enabled: shouldCheckUsername,
    retry: false,
    staleTime: 60 * 1000,
  });

  const usernameAvailability = useMemo<UsernameAvailabilityStatus>(() => {
    if (!debouncedUsername || debouncedUsername === currentUsername) {
      return DEFAULT_USERNAME_STATUS;
    }

    if (!USERNAME_PATTERN.test(debouncedUsername)) {
      return DEFAULT_USERNAME_STATUS;
    }

    if (usernameAvailabilityQuery.isFetching) {
      return { state: 'checking', message: 'Checking username...' };
    }

    if (usernameAvailabilityQuery.isError) {
      return {
        state: 'error',
        message: 'Could not check username right now',
      };
    }

    if (usernameAvailabilityQuery.data?.available) {
      return { state: 'available', message: 'Username is available' };
    }

    if (usernameAvailabilityQuery.data && !usernameAvailabilityQuery.data.available) {
      return {
        state: 'unavailable',
        message: usernameAvailabilityQuery.data.message ?? 'Username is already taken',
      };
    }

    return DEFAULT_USERNAME_STATUS;
  }, [
    currentUsername,
    debouncedUsername,
    usernameAvailabilityQuery.data,
    usernameAvailabilityQuery.isError,
    usernameAvailabilityQuery.isFetching,
  ]);


  
  const avatarMutation = useAvatarUpload();
  const onPickAvatar = async () => {
    const imageBlob = await pickAvatar();
    if(!imageBlob?.uri) {
      Alert.alert('No Image Selected', 'Please select an image to use as your avatar.');
      return;
    }
    console.log('Picked avatar URI:', imageBlob.uri);
    const currentAvatar = form.getValues('avatarUri');
    const currentUserId = user?.id;

    if (!currentUserId) {
      Alert.alert('User Not Found', 'Unable to identify user for avatar upload.');
      return;
    }
    avatarMutation.mutate({imageBlob, userId: currentUserId}, {
      onSuccess: (uploadedUri) => {
        console.log('Avatar uploaded successfully:', uploadedUri);
        updateField('avatarUri', uploadedUri);
      },
      onError: () => {
        Alert.alert('Upload Failed', 'Failed to upload avatar. Please try again.');
        updateField('avatarUri', "");
        return;
      },
    });


    
    
  };




  const updateProfileMutation = useProfileUpdate();
  const handleSave = form.handleSubmit(async (values) => {
    if (!user) {
      setIsEditing(false);
      return;
    }

    if (usernameAvailability.state === 'checking') {
      return;
    }

    if (
      usernameAvailability.state === 'unavailable' ||
      usernameAvailability.state === 'error'
    ) {
      form.setError('username', {
        type: 'validate',
        message: usernameAvailability.message,
      });
      return;
    }

    setIsSaving(true);

    const nextUser = {
      ...user,
      // for db update
      fullName: values.fullName.trim() ?? "",
      username: values.username.trim() ?? "",
      gender: values.gender,
      occupation: values.occupation as TOccupation,
      avatar: values.avatarUri.trim(),
      bio: values.bio.trim(),
      address : {
        line1: values.address.trim() || null,
        latitude: locationData?.latitude ?? user?.latitude ?? null,
        longitude: locationData?.longitude ?? user?.longitude ?? null,
        state: values.state.trim() || null,
        city: values.city.trim() || null,
        district: locationData?.district?.trim() || user?.district?.trim() || null,
        country: locationData?.country?.trim() || null,
      },

     
      isProfileCompleted: Boolean(
        values.fullName.trim() &&
        values.username.trim() &&
        values.bio.trim() &&
        values.state.trim() &&
        values.city.trim() &&
        values.address.trim() &&
        values.gender &&
        values.avatarUri.trim()
      ),
    };

    console.log('Saving user profile with data:', nextUser);

    updateProfileMutation.mutate(nextUser, {
      onSuccess: (updatedProfile) => {
        console.log('Profile updated successfully:', updatedProfile);
        setUser(updatedProfile);
        Alert.alert('Success', 'Your profile has been updated successfully.');
      },
      onError: (error) => {
        console.error('Failed to update profile:', error);
        Alert.alert('Update Failed', 'Failed to update profile. Please try again.');
      },
    });


    setUser(nextUser);





    setIsSaving(false);
    setIsEditing(false);
  });

  const isSaveDisabled =
    !form.formState.isValid ||
    usernameAvailability.state === 'checking' ||
    usernameAvailability.state === 'unavailable' ||
    usernameAvailability.state === 'error' ||
    isSaving;

  return {
    profile,
    form,
    updateField,
    usernameAvailability,
    isSaving,
    isSaveDisabled,
    handleSave,
    isEditing,
    setIsEditing,
    occupationSheetOpen,
    setOccupationSheetOpen,
    activeTab,
    setActiveTab,
    onPickAvatar,
    locationData,
  };
};

export type UseProfileFormReturn = ReturnType<typeof useProfileForm>;
