import { endPoints, nodeApi } from "@/shared/api";
import { GenerateTokenData, NodeApiResponse } from "../types/voice.types";

const generateLivekitToken = async () => {
    const { url, method } = endPoints.LIVEKIT.GENERATE_TOKEN;
    const res = await nodeApi.request({
        url,
        method,
    })
    return res as unknown as NodeApiResponse<GenerateTokenData>;
};


export { generateLivekitToken };
