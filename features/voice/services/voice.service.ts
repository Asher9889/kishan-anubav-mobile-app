import { api, endPoints } from "@/shared/api";

export async function uploadVoice(audioUri: string) {
    try {
        const formData = new FormData();

        formData.append("audio", {
            uri: audioUri,
            name: `voice-${Date.now()}.m4a`,
            type: "audio/m4a",
        } as any);

        const { method, url } = endPoints.AI.VOICE

        const response = await api.request({
            // url: url,
            url: "https://webhook.site/c760b26c-10ef-4b47-aea6-7aa632fdb386",
            method: method,
            data: formData,
        })
        return response;

    } catch (error: any) {
        console.log("Voice upload error:", error.message || error.response?.data || error);

        throw error;
    }
}