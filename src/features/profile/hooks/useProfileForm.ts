import { useAuthStore } from '@/features/auth/store/auth.store';
import type { AuthUser, AuthUserAddress } from '@/features/auth/types/user';
import { useCurrentLocation } from '@/shared/hooks/useCurrentLocation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from '@tanstack/react-query';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  useForm,
  useWatch,
  type Path,
  type PathValue,
  type UseFormReturn,
} from 'react-hook-form';
import { Alert } from 'react-native';
import { checkUsernameAvailability, type UpdateProfileFieldPayload } from '../api/profile.api';
import type { GenderValue, TOccupation } from '../types/profile.types';
import {
  editProfileSchema,
  type EditProfileFormValues,
} from '../validation/edit-profile.schema';
import { useAvatarPicker } from './useAvatarPicker';
import { useAvatarUpload } from './useAvatarUpload';
import useProfileUpdate, { useProfileFieldUpdate } from './useProfileUpdate';

export type ProfileFormState = EditProfileFormValues;
export type EditableProfileTextField = 'fullName' | 'username' | 'bio' | 'state' | 'city' | 'address';
export type EditableProfileSelectField = 'gender' | 'occupation';
export type EditableProfileField = EditableProfileTextField | EditableProfileSelectField;

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
  state: user?.state?.trim() ?? getAddressObject(user).state?.trim() ?? '',
  city: user?.city?.trim() ?? getAddressObject(user).city?.trim() ?? '',
  address: getAddressLine1(user),
  avatarUri: user?.avatar?.trim() ?? '',
  website: '',
});

const getAddressObject = (user: AuthUser | null): AuthUserAddress => {
  if (!user?.address) return {};

  if (typeof user.address === 'string') {
    return { line1: user.address };
  }


  return user.address;
};

const getAddressLine1 = (user: AuthUser | null): string =>
  getAddressObject(user).line1?.trim() ?? '';

const createFocusedFieldPayload = (
  field: EditableProfileField,
  value: string
): UpdateProfileFieldPayload => {
  switch (field) {
    case 'fullName':
      return { fullName: value };
    case 'username':
      return { username: value };
    case 'bio':
      return { bio: value };
    case 'state':
      return { address: { state: value } };
    case 'city':
      return { address: { city: value } };
    case 'address':
      return { address: { line1: value } };
    case 'gender':
      return { gender: value as GenderValue };
    case 'occupation':
      return { occupation: value as TOccupation };
  }
};

const applyFocusedFieldToUser = (
  currentUser: AuthUser,
  field: EditableProfileField,
  value: string,
  updatedProfile?: Partial<AuthUser> | null
): AuthUser => {
  const currentAddress = getAddressObject(currentUser);
  const updatedAddress =
    updatedProfile?.address && typeof updatedProfile.address !== 'string'
      ? updatedProfile.address
      : {};
  const nextAddress = {
    ...currentAddress,
    ...updatedAddress,
  };
  const nextUser = {
    ...currentUser,
    ...(updatedProfile ?? {}),
  };

  switch (field) {
    case 'fullName':
      return { ...nextUser, fullName: updatedProfile?.fullName ?? value };
    case 'username':
      return { ...nextUser, username: updatedProfile?.username ?? value };
    case 'bio':
      return { ...nextUser, bio: updatedProfile?.bio ?? value };
    case 'state':
      return {
        ...nextUser,
        state: updatedProfile?.state ?? updatedAddress.state ?? value,
        address: {
          ...nextAddress,
          state: updatedAddress.state ?? value,
        },
      };
    case 'city':
      return {
        ...nextUser,
        city: updatedProfile?.city ?? updatedAddress.city ?? value,
        address: {
          ...nextAddress,
          city: updatedAddress.city ?? value,
        },
      };
    case 'address':
      return {
        ...nextUser,
        address: {
          ...nextAddress,
          line1: updatedAddress.line1 ?? value,
        },
      };
    case 'gender':
      return { ...nextUser, gender: updatedProfile?.gender ?? value };
    case 'occupation':
      return { ...nextUser, occupation: updatedProfile?.occupation ?? value };
  }
};

export const useProfileForm = () => {
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  const { pickAvatar } = useAvatarPicker();

  const currentAddress = getAddressObject(user);
  const shouldFetchLocation =
    !user?.state?.trim() ||
    !user?.city?.trim() ||
    !currentAddress.line1?.trim();
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
  const [activeTab, setActiveTab] = useState<'grid' | 'reels' | 'tags'>('grid');
  const [debouncedUsername, setDebouncedUsername] = useState('');

  const updateField = useCallback(<K extends Path<ProfileFormState>>(
    field: K,
    value: PathValue<ProfileFormState, K>
  ) => {
    form.setValue(field, value, {
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
    if (!imageBlob?.uri) {
      Alert.alert('No Image Selected', 'Please select an image to use as your avatar.');
      return;
    }
    const currentUserId = user?.id;

    if (!currentUserId) {
      Alert.alert('User Not Found', 'Unable to identify user for avatar upload.');
      return;
    }
    avatarMutation.mutate({ imageBlob, userId: currentUserId }, {
      onSuccess: async (uploadedUri) => {
        if (!uploadedUri) {
          Alert.alert('Upload Failed', 'The uploaded image URL was empty. Please try again.');
          return;
        }

        const latestUser = useAuthStore.getState().user ?? user;
        setUser({ ...latestUser, avatar: uploadedUri });
        updateField('avatarUri', uploadedUri);

        try {
          const updatedProfile = await updateProfileFieldMutation.mutateAsync({
            avatar: uploadedUri,
          });
          const currentStoreUser = useAuthStore.getState().user;
          setUser({
            ...(currentStoreUser ?? latestUser),
            ...updatedProfile,
            avatar: updatedProfile.avatar ?? uploadedUri,
          });
          form.reset({
            ...form.getValues(),
            avatarUri: updatedProfile.avatar ?? uploadedUri,
          });
        } catch {
          Alert.alert(
            'Profile Photo Saved Locally',
            'The photo was uploaded, but we could not save it to your profile. Please try again.'
          );
        }
      },
      onError: () => {
        Alert.alert('Upload Failed', 'Failed to upload avatar. Please try again.');
        // updateField('avatarUri', "");
        return;
      },
    });




  };




  const updateProfileMutation = useProfileUpdate();
  const updateProfileFieldMutation = useProfileFieldUpdate();

  const saveFocusedField = useCallback(async (field: EditableProfileField) => {
    if (!user) {
      return false;
    }

    const nextValue = String(form.getValues(field) ?? '').trim();
    const currentValue = String(createInitialState(user)[field] ?? '').trim();

    form.setValue(field, nextValue as PathValue<ProfileFormState, typeof field>, {
      shouldDirty: nextValue !== currentValue,
      shouldTouch: true,
      shouldValidate: true,
    });

    if (nextValue === currentValue) {
      form.clearErrors(field);
      return true;
    }

    const isFieldValid = await form.trigger(field);
    if (!isFieldValid) {
      return false;
    }

    if (field === 'username') {
      try {
        const usernameCheck = await checkUsernameAvailability(nextValue);

        if (!usernameCheck.available) {
          form.setError('username', {
            type: 'validate',
            message: usernameCheck.message ?? 'Username is already taken',
          });
          return false;
        }
      } catch {
        form.setError('username', {
          type: 'validate',
          message: 'Could not check username right now',
        });
        return false;
      }
    }

    try {
      const updatedProfile = await updateProfileFieldMutation.mutateAsync(
        createFocusedFieldPayload(field, nextValue)
      );
      const nextUser = applyFocusedFieldToUser(user, field, nextValue, updatedProfile);

      setUser(nextUser);

      form.clearErrors(field);
      form.reset({
        ...form.getValues(),
        [field]: nextValue,
      });

      return true;
    } catch (error) {
      console.error('Failed to update profile field:', error);
      Alert.alert('Update Failed', 'Failed to update this field. Please try again.');
      return false;
    }
  }, [form, setUser, updateProfileFieldMutation, user]);

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
      address: {
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

    updateProfileMutation.mutate(nextUser, {
      onSuccess: (updatedProfile) => {
        setUser(updatedProfile);
        Alert.alert('Success', 'Your profile has been updated successfully.');
      },
      onError: () => {
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
    isFocusedFieldSaving: updateProfileFieldMutation.isPending,
    isSaveDisabled,
    handleSave,
    saveFocusedField,
    isEditing,
    setIsEditing,
    activeTab,
    setActiveTab,
    onPickAvatar,
    locationData,
  };
};

export type UseProfileFormReturn = ReturnType<typeof useProfileForm>;
