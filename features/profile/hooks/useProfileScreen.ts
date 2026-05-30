import { useMemo, useState } from 'react';

import { useAuthStore } from '@/features/auth/store/auth.store';

import { PROFILE_POSTS, PROFILE_STATS } from '../constants/profile.constants';
import type { ProfileTabKey } from '../types/profile.types';

const getInitials = (fullName: string | null | undefined): string => {
  const normalized = fullName?.trim();

  if (!normalized) {
    return 'FR';
  }

  const parts = normalized.split(/\s+/).filter(Boolean);
  const first = parts[0]?.[0] ?? 'F';
  const second = parts.length > 1 ? parts[parts.length - 1]?.[0] ?? 'R' : parts[0]?.[1] ?? 'R';

  return `${first}${second}`.toUpperCase();
};

const getLocationLabel = (village?: string | null, district?: string | null, state?: string | null): string | undefined => {
  const parts = [village, district, state].filter((part): part is string => Boolean(part && part.trim()));

  return parts.length > 0 ? parts.join(', ') : undefined;
};

const getCompletionProgress = (user: {
  fullName?: string | null;
  name?: string | null;
  username?: string | null;
  bio?: string | null;
  gender?: string | null;
  avatar?: string | null;
  village?: string | null;
  district?: string | null;
  state?: string | null;
} | null): number => {
  if (!user) {
    return 0;
  }

  const completionFields = [
    user.fullName ?? user.name,
    user.username,
    user.bio,
    user.gender,
    user.avatar,
    user.village,
    user.district,
    user.state,
  ];

  const completedCount = completionFields.filter((value) => Boolean(value && String(value).trim())).length;

  return Math.round((completedCount / completionFields.length) * 100);
};

export const useProfileScreen = () => {
  const user = useAuthStore((state) => state.user);
  const [activeTab, setActiveTab] = useState<ProfileTabKey>('posts');

  const viewModel = useMemo(() => {
    const fullName = user?.fullName?.trim() || user?.name?.trim() || 'Farmer profile';
    const username = user?.username?.trim();
    const location = getLocationLabel(user?.village, user?.district, user?.state);
    const initials = getInitials(user?.fullName ?? user?.name);
    const completionProgress = getCompletionProgress(user);
    const isProfileCompleted = Boolean(user?.isProfileCompleted);

    return {
      user,
      fullName,
      username,
      location,
      initials,
      completionProgress,
      isProfileCompleted,
      posts: PROFILE_POSTS,
      stats: PROFILE_STATS,
    };
  }, [user]);

  return {
    ...viewModel,
    activeTab,
    setActiveTab,
  };
};
