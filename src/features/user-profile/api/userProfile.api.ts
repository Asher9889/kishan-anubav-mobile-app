import { endPoints } from '@/shared/api';
import { nodeApi } from '@/shared/api/axios';
import type { GetPostsResponse } from '@/features/profile/types/profile.types';
import type { UserProfileApiResponse, UserProfileData } from '../types/userProfile.types';

export const fetchUserProfile = async (userId: string): Promise<UserProfileData> => {
  const { url, method } = endPoints.USER.GET_PROFILE;
  const apiUrl = url.replace(':id', userId);

  const response = await nodeApi.request<UserProfileApiResponse>({
    url: apiUrl,
    method,
  });

  const data = response as unknown as UserProfileApiResponse;
  return data.data.user;
};

export const fetchUserPosts = async (userId: string): Promise<GetPostsResponse> => {
  const { url, method } = endPoints.POSTS.GET;

  const response = await nodeApi.request<GetPostsResponse>({
    url,
    method,
    params: {
      userId,
      limit: 20,
      page: 1,
    },
  });

  return response as unknown as GetPostsResponse;
};
