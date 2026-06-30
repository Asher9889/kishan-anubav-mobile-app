import { useMutation, useQueryClient } from '@tanstack/react-query';

import { followUser, unfollowUser } from '../api/userProfile.api';
import type { UserProfileData } from '../types/userProfile.types';

export function useFollowToggle(userId: string) {
  const queryClient = useQueryClient();
  const queryKey = ['userProfile', userId];

  return useMutation({
    mutationFn: async (currentlyFollowing: boolean) => {
      if (currentlyFollowing) {
        await unfollowUser(userId);
      } else {
        await followUser(userId);
      }
    },
    onMutate: async (currentlyFollowing) => {
      await queryClient.cancelQueries({ queryKey });

      const previousData = queryClient.getQueryData<UserProfileData>(queryKey);

      queryClient.setQueryData<UserProfileData>(queryKey, (old) => {
        if (!old) return old;
        return {
          ...old,
          isFollowing: !currentlyFollowing,
          followersCount: old.followersCount + (currentlyFollowing ? -1 : 1),
        };
      });

      return { previousData };
    },
    onError: (_err, _currentlyFollowing, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(queryKey, context.previousData);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });
}
