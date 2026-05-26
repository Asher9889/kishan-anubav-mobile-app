import { api, endPoints } from "@/shared/api";
import { AskAudioApiResponse } from "@/shared/api/types";

export async function uploadVoice(audioUri: string, chatId?: string | null): Promise<AskAudioApiResponse> {
    const formData = new FormData();

    formData.append("file", {
        uri: audioUri,
        name: `voice-${Date.now()}.m4a`,
        type: "audio/m4a",
    } as any);

    if (chatId) {
        formData.append("thread_id", chatId);
    }

    const { method, url } = endPoints.AI.VOICE;

    const response = await api.request<AskAudioApiResponse, AskAudioApiResponse>({
        url,
        method,
        data: formData,
    });

    console.log("Voice upload response:", response.data);
    return response;
}