import { api, endPoints } from "@/shared/api";
import { AskAudioApiResponse, AskAudioResponseData } from "@/shared/api/types";

export async function uploadVoice(audioUri: string, chatId?: string | null): Promise<AskAudioResponseData> {
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

    const response = await api.request<AskAudioApiResponse | AskAudioResponseData, AskAudioApiResponse | AskAudioResponseData>({
        url,
        method,
        data: formData,
    });

    const normalized = (response as AskAudioApiResponse)?.data ?? (response as AskAudioResponseData);

    console.log("Voice upload response:", normalized);
    return normalized;
}