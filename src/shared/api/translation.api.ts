import { nodeApi } from "./axios";
import { endPoints } from "./endpoints";

type TranslateParams = {
  text: string;
  sourceLanguage: string;
  targetLanguage: string;
};

type TranslateResponse = {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    translatedText: string;
  };
};

export async function translateText(params: TranslateParams): Promise<string> {
  const { url, method } = endPoints.TRANSLATION.TRANSLATE;
  const response = await nodeApi.request<TranslateResponse, TranslateResponse>({
    url,
    method,
    data: params,
  });

  console.log("Translation API Response:", response); // Log the entire response for debugging
  return response.data.translatedText;
}
