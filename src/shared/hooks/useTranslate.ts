import { useQuery } from "@tanstack/react-query";
import { translateText } from "../api/translation.api";

export function useTranslate(
  text: string,
  targetLanguage: string,
  sourceLanguage = "en"
) {
  return useQuery({
    queryKey: ["translate", text, sourceLanguage, targetLanguage],
    queryFn: () => translateText({ text, sourceLanguage, targetLanguage }),
    enabled: text.length > 0 && targetLanguage !== sourceLanguage,
    staleTime: Infinity,
  });
}
