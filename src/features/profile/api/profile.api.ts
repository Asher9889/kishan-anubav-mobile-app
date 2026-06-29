import { endPoints } from '@/shared/api';
import { nodeApi } from '@/shared/api/axios';
import { ImagePickerAsset } from 'expo-image-picker';
import type { GenderValue, GetPostsResponse, TOccupation, UpdateProfileData } from '../types/profile.types';

type UsernameAvailabilityResponse = {
  available: boolean;
  message?: string;
};

export type ProfileAddressUpdatePayload = Partial<{
  line1: string | null;
  line2: string | null;
  latitude: number | null;
  longitude: number | null;
  city: string | null;
  district: string | null;
  state: string | null;
  postalCode: string | null;
  country: string | null;
}>;

export type UpdateProfileFieldPayload = Partial<{
  fullName: string;
  username: string;
  bio: string;
  gender: GenderValue;
  occupation: TOccupation;
  avatar: string | null;
  address: ProfileAddressUpdatePayload;
}>;

type UnknownRecord = Record<string, unknown>;

const isRecord = (value: unknown): value is UnknownRecord =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const unwrapData = (payload: unknown): unknown => {
  if (!isRecord(payload)) return payload;

  return payload.data ?? payload;
};

const readString = (value: unknown): string | undefined =>
  typeof value === 'string' ? value : undefined;

const readProfile = (payload: unknown): UpdateProfileData => {
  const data = unwrapData(payload);

  if (isRecord(data) && isRecord(data.user)) {
    return data.user as unknown as UpdateProfileData;
  }

  return data as unknown as UpdateProfileData;
};

const readAvailability = (payload: unknown): UsernameAvailabilityResponse => {
  const data = unwrapData(payload);
  const available =
    isRecord(data)
      ? data.available ??
      data.isAvailable ??
      data.usernameAvailable ??
      (data.exists === false ? true : undefined)
      : undefined;

  if (typeof available !== 'boolean') {
    return {
      available: false,
      message: isRecord(data)
        ? readString(data.message) ?? 'Unable to verify username availability'
        : 'Unable to verify username availability',
    };
  }

  return {
    available,
    message: isRecord(data) ? readString(data.message) : undefined,
  };
};

export const checkUsernameAvailability = async (username: string): Promise<UsernameAvailabilityResponse> => {
  const { url, method } = endPoints.USER.CHECK_USERNAME;

  const response = await nodeApi.request({
    url,
    method,
    params: { username },
  });

  return readAvailability(response);
};

export const uploadAvatar = async (imageBlob: ImagePickerAsset, userId: string): Promise<string> => {
  const { url, method } = endPoints.UPLOAD.AVATAR;

  const formData = new FormData();
  formData.append('avatar', {
    uri: imageBlob.uri,
    name: imageBlob.fileName,
    type: imageBlob.mimeType,
  } as unknown as Blob);
  formData.append('userId', userId);

  const response = await nodeApi.request({
    url,
    method,
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  const data = unwrapData(response);

  return isRecord(data) && typeof data.url === 'string' ? data.url : '';
}

export const updateProfile = async (profileData: UpdateProfileData): Promise<UpdateProfileData> => {
  const { url, method } = endPoints.USER.UPDATE_PROFILE;
  const response = await nodeApi.request({
    url: url,
    method,
    data: profileData,
  });

  return readProfile(response);
}

export const updateProfileField = async (payload: UpdateProfileFieldPayload, userId: string): Promise<UpdateProfileData> => {
  const { url, method } = endPoints.USER.UPDATE_PROFILE;
  const apiUrl = url.replace(':id', userId);
  const response = await nodeApi.request({
    url: apiUrl,
    method,
    data: payload,
  });

  return readProfile(response);
}

export const fetchUserPost = async () => {
  const { url, method } = endPoints.POSTS.GET;
 
  const response = await nodeApi.request<GetPostsResponse>({
    url: url,
    method: method,
    params: {
      limit: 20,
      page: 1
    }
  });
  console.log('[GET_ALL_POSTS] API Response:', response);
  return response as unknown as GetPostsResponse;
}
