import { useMutation } from "@tanstack/react-query";
import { ImagePickerAsset } from "expo-image-picker";
import { uploadAvatar } from "../api/profile.api";

type AvatarUploadPayload = {
  imageBlob: ImagePickerAsset;
  userId: string;
};

export const useAvatarUpload = () => {
  const mutation =  useMutation({
    mutationFn: (payload: AvatarUploadPayload) => uploadAvatar(payload.imageBlob, payload.userId),
    onSuccess: (url) => {
      // You can handle any side effects here, such as updating the user's profile with the new avatar URL
      console.log("Avatar uploaded successfully:", url);
    },
    onError: (error) => {
      console.error("Failed to upload avatar:", error);
    },
  });
  return mutation;
};