import { useState, useEffect, useCallback } from 'react';
import { useAuthStore } from '@/features/auth/store/auth.store';
import { useCurrentLocation } from '@/shared/hooks/useCurrentLocation';
import type { AuthUser } from '@/features/auth/types/user';
import type { GenderValue, TOccupation } from '../types/profile.types';
import { useAvatarPicker } from './useAvatarPicker';

export type ProfileFormState = {
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

const createInitialState = (user: AuthUser | null): ProfileFormState => ({
  fullName: user?.fullName?.trim() ?? '',
  username: user?.username?.trim() ?? '',
  bio: user?.bio?.trim() ?? '',
  gender: (user?.gender as GenderValue) ?? '',
  occupation: (user?.occupation as TOccupation) ?? '',
  state: user?.state?.trim() ?? '',
  city: user?.city?.trim() ?? '',
  address: user?.address?.trim() ?? '',
  avatarUri: user?.avatar?.trim() ?? '',
  website: '',
});

export const useProfileForm = () => {
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  const { pickAvatar } = useAvatarPicker();

  const shouldFetchLocation = !user?.state?.trim() || !user?.city?.trim() || !user?.address?.trim();
  const { data: locationData } = useCurrentLocation({ enabled: shouldFetchLocation });

  const [profile, setProfile] = useState<ProfileFormState>(() => createInitialState(user));
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [occupationSheetOpen, setOccupationSheetOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'grid' | 'reels' | 'tags'>('grid');

  const updateField = useCallback(<K extends keyof ProfileFormState>(
    field: K,
    value: ProfileFormState[K]
  ) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  }, []);

  // Sync with user data
  useEffect(() => {
    setProfile(createInitialState(user));
  }, [user]);

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

    setProfile((prev) => ({
      ...prev,
      state: prev.state || locationState,
      city: prev.city || locationCity,
      address: prev.address || locationAddress,
    }));
  }, [locationData]);

  const onPickAvatar = async () => {
    const uri = await pickAvatar();
    if (uri) {
      updateField('avatarUri', uri);
    }
  };

  const handleSave = async () => {
    if (!user) {
      setIsEditing(false);
      return;
    }
    setIsSaving(true);

    const nextUser: AuthUser = {
      ...user,
      fullName: profile.fullName.trim() || null,
      name: profile.fullName.trim() || null,
      username: profile.username.trim() || null,
      bio: profile.bio.trim() || null,
      state: profile.state.trim() || null,
      city: profile.city.trim() || null,
      address: profile.address.trim() || null,
      latitude: locationData?.latitude ?? user?.latitude ?? null,
      longitude: locationData?.longitude ?? user?.longitude ?? null,
      gender: profile.gender || null,
      occupation: profile.occupation || null,
      avatar: profile.avatarUri.trim() || null,
      isProfileCompleted: Boolean(
        profile.fullName.trim() &&
        profile.username.trim() &&
        profile.bio.trim() &&
        profile.state.trim() &&
        profile.city.trim() &&
        profile.address.trim() &&
        profile.gender &&
        profile.avatarUri.trim()
      ),
    };

    setUser(nextUser);
    setIsSaving(false);
    setIsEditing(false);
  };

  const isSaveDisabled =
    !profile.fullName.trim() ||
    !profile.username.trim() ||
    !profile.bio.trim() ||
    !profile.state.trim() ||
    !profile.city.trim() ||
    !profile.address.trim() ||
    !profile.gender ||
    !profile.avatarUri.trim() ||
    isSaving;

  return {
    profile,
    updateField,
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
