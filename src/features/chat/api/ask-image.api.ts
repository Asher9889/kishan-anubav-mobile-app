import { envConfig } from '@/config';
import { endPoints } from '@/shared/api/endpoints';

export type ImageAnalysisResponse = {
  success: boolean;
  image_analysis?: {
    crop_name: string;
    scientific_name: string;
    crop_confidence: number;
    plant_part: string;
    visible_symptoms: string[];
    visible_damage: string[];
    severity: string;
  };
  question_text?: string;
  message?: string;
};

export async function analyzeImage(imageUri: string): Promise<ImageAnalysisResponse> {
  const { method, url } = endPoints.AI.IMAGE;
  // const fullUrl = API_BASE_URL + url;
  const fullUrl = envConfig.aiApiBaseUrl + url;

  // console.log('Analyzing image at ' + fullUrl + ' for chatId:', chatId);

  const formData = new FormData();

  formData.append("file", {
    uri: imageUri,
    type: "image/jpg",
    name: `image-${Date.now()}.jpg`,
  } as any);

  // formData.append("thread_id", chatId);

  const response = await fetch(fullUrl, {
    method,
    headers: {
      "Accept": "application/json",
    },
    body: formData,
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.log('Image API Error:', errorText);
    return { success: false, message: errorText };
  }

  const result: ImageAnalysisResponse = await response.json();
  return result;
}
