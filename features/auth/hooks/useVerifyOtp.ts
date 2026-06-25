import { useMutation } from "@tanstack/react-query";
import * as SecureStore from "expo-secure-store";
import { verifyOTP } from "../api/login.api";
import { useAuthStore } from "../store/auth.store";

const useVerifyOtp = () => {
  const login = useAuthStore((state) => state.login);

  return useMutation({
    mutationFn: verifyOTP,
    onSuccess: async (res, variables) => {
      const data = res.data // Adjust this if your API response structure is different
      const user = data?.user;
      const tokens = data?.tokens;

      const accessToken = tokens?.accessToken;
      const refreshToken = tokens?.refreshToken;
      const userId = user?.id;
      const userPhone = user?.phone;

      if (accessToken && userId) {
        login({
          user: {
            id: userId,
            phone: userPhone,
          },
          accessToken,
        });
      } else {
        console.log("Verify OTP succeeded but token payload was incomplete", data);
      }

      if (refreshToken) {
        await SecureStore.setItemAsync("refreshToken", refreshToken);
      }
    },
    onError: (err) => {
      console.log("error got inside hook", err)
    }
  });
};

export default useVerifyOtp;
