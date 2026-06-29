import { useQuery } from '@tanstack/react-query';
import { useLocalSearchParams } from 'expo-router';

import type { Post } from '@/features/profile/types/profile.types';
import { fetchUserPosts, fetchUserProfile } from '../api/userProfile.api';
import type { UserProfileData } from '../types/userProfile.types';

type UseUserProfileResult = {
  userId: string;
  user: UserProfileData | null;
  isLoading: boolean;
  error: Error | null;
  posts: Post[];
  isLoadingPosts: boolean;
};

export function useUserProfile(): UseUserProfileResult {
  const { id } = useLocalSearchParams<{ id: string }>();
  const userId = id ?? '';

  const userQuery = useQuery<UserProfileData>({
    queryKey: ['userProfile', userId],
    queryFn: () => fetchUserProfile(userId),
    enabled: !!userId,
  });

  const postsQuery = useQuery({
    queryKey: ['userPosts', userId],
    queryFn: () => fetchUserPosts(userId),
    enabled: !!userId,
    select: (data) => data?.data?.posts ?? [],
  });

  return {
    userId,
    user: userQuery.data ?? null,
    isLoading: userQuery.isLoading,
    error: userQuery.error as Error | null,
    posts: postsQuery.data ?? [],
    isLoadingPosts: postsQuery.isLoading,
  };
}
