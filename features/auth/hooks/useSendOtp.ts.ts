import { useMutation } from "@tanstack/react-query";
import { router } from "expo-router";
import { sendOTP } from "../api/login.api";

const useSendOtp = () => {

    return useMutation({
        mutationFn: sendOTP,
        onSuccess: (data, variables) => {
            console.log("OTP sent successfully:", data);
            const { phone } = variables;
            const reqId = data?.reqId ?? data?.data?.reqId;

            if (!reqId) {
                console.error("OTP request succeeded but reqId was missing in response", data);
                return;
            }

            router.push({
                pathname: "/verify-otp",
                params: {
                    phone: phone,
                    reqId: reqId,
                },
            });
        },
        onError: (error) => {
            console.error("Error sending OTP:", error);
        }
    });
    
};

export default useSendOtp;