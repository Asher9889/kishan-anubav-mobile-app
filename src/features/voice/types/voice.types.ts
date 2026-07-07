
export type VoiceState = "idle" | "listening" | "thinking" | "speaking" | "loading" | "hidden" | "connected" | "disconnected";
export interface NodeApiResponse<T>{
    success: boolean;
    statusCode: number;
    message: string;
    data: T;
};

export type GenerateTokenData = {
    token: string;
    roomName: string;
    name: string;
}



