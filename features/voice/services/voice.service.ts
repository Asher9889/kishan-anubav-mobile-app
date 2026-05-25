import { api, endPoints } from "@/shared/api";
import { AskAudioApiResponse } from "@/shared/api/types";

export async function uploadVoice(audioUri: string): Promise<AskAudioApiResponse> {
    const formData = new FormData();

    formData.append("file", {
        uri: audioUri,
        name: `voice-${Date.now()}.m4a`,
        type: "audio/m4a",
    } as any);

    const { method, url } = endPoints.AI.VOICE;

    const response = await api.request<AskAudioApiResponse, AskAudioApiResponse>({
        url,
        method,
        data: formData,
    });

    console.log("Voice upload response:", response.data);
    return response;

}