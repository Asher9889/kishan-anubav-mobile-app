import { endPoints } from "@/shared/api";
import { nodeApi } from "@/shared/api/axios";

type SendOtpPayload = {
    phone: string;
};

type VerifyOtpPayload = {
    phone: string;
    otp: string;
    reqId: string;
};

type SendOtpResponse = {
    reqId?: string;
    data?: {
        reqId?: string;
    };
};

type VerifyOtpResponse = {
    user: {
        id: string;
        phone: string;
    };
    tokens: {
        accessToken: string;
        refreshToken: string;
    }
};

const sendOTP = async ({ phone }: SendOtpPayload): Promise<SendOtpResponse> => {
    // Call your API to send OTP here. Accept an object payload to match
    // how mutate() is called (mutate({ phone: `+91${phoneNumber}` })).
    const { url, method } = endPoints.AUTH.SEND_OTP;
    console.log("Sending OTP to:", phone);
    const response = await nodeApi.request<SendOtpResponse>({
        url: url,
        method: method,
        data: { phone },
    });
    return (response as any)?.data ?? (response as any);
};

const verifyOTP = async ({ phone, otp, reqId }: VerifyOtpPayload): Promise<VerifyOtpResponse> => {
    const { url, method } = endPoints.AUTH.VERIFY_OTP;
    const response = await nodeApi.request<VerifyOtpResponse>({
        url: url,
        method: method,
        data: { phone, otp, reqId },
    });

    return response.data;
};

export { sendOTP, verifyOTP };
export type { SendOtpPayload, SendOtpResponse, VerifyOtpPayload, VerifyOtpResponse };

