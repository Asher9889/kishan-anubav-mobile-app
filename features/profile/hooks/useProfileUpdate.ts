import { useMutation } from "@tanstack/react-query";
import { updateProfile } from "../api/profile.api";
import { UpdateProfileData } from "../types/profile.types";


const useProfileUpdate = () => {
  const mutation = useMutation({
    mutationFn: (profileData:UpdateProfileData) => updateProfile(profileData),
    onSuccess: (data) => {
      // Handle successful profile update, e.g., show a success message or update local state
      console.log("Profile updated successfully:", data);
    },
    onError: (error) => {
      // Handle errors, e.g., show an error message
      console.error("Failed to update profile:", error);
    },
  });

  return mutation;
}

export default useProfileUpdate;