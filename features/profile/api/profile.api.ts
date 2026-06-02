import { endPoints } from '@/shared/api';
import { nodeApi } from '@/shared/api/axios';
import { ImagePickerAsset } from 'expo-image-picker';
import { UpdateProfileData } from '../types/profile.types';

type UsernameAvailabilityResponse = {
  available: boolean;
  message?: string;
};

const readAvailability = (payload: any): UsernameAvailabilityResponse => {
  const data = payload?.data ?? payload;
  const available =
    data?.available ??
    data?.isAvailable ??
    data?.usernameAvailable ??
    data?.exists === false;

  if (typeof available !== 'boolean') {
    return {
      available: false,
      message: data?.message ?? 'Unable to verify username availability',
    };
  }

  return {
    available,
    message: data?.message,
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
  } as any);
  formData.append('userId', userId);

  const response = await nodeApi.request({
    url,
    method,
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data?.url;
}

export const updateProfile = async (profileData: UpdateProfileData):Promise<UpdateProfileData> => {
  const { url, method } = endPoints.USER.UPDATE_PROFILE;
  const response = await nodeApi.request({
    url: url.replace(':id', profileData.id),
    method,
    data: profileData,
  });
  
  return response.data as UpdateProfileData;
}
