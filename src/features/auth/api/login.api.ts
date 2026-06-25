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
    success: boolean;
    statusCode: number;
    message: string;
    data: {
        user: {
            id: string;
            phone: string;
        };
        tokens: {
            accessToken: string;
            refreshToken: string;
        }
    }

};

const sendOTP = async ({ phone }: SendOtpPayload): Promise<SendOtpResponse> => {
    // Call your API to send OTP here. Accept an object payload to match
    // how mutate() is called (mutate({ phone: `+91${phoneNumber}` })).
    const { url, method } = endPoints.AUTH.SEND_OTP;
    console.log("Sending OTP to:", phone);
    return await nodeApi.request<SendOtpResponse>({
        url: url,
        method: method,
        data: { phone },
    });
};

const verifyOTP = async ({ phone, otp, reqId }: VerifyOtpPayload): Promise<VerifyOtpResponse> => {
    const { url, method } = endPoints.AUTH.VERIFY_OTP;
    const data =  await nodeApi.request({
        url: url,
        method: method,
        data: { phone, otp, reqId },
    });
    console.log("API response from verifyOTP:", data);
    return data as unknown as VerifyOtpResponse;
};

export { sendOTP, verifyOTP };
export type { SendOtpPayload, SendOtpResponse, VerifyOtpPayload, VerifyOtpResponse };

