import { useMutation } from "@tanstack/react-query";
import { ImagePickerAsset } from "expo-image-picker";
import { Alert } from "react-native";
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
      console.log("Avatar upload failed:", error);
      Alert.alert("Avatar Upload Failed", error instanceof Error ? error.message : "An unknown error occurred." );
    },
  });
  return mutation;
};