import { useMutation } from "@tanstack/react-query";
import * as Haptics from 'expo-haptics';
import { useState } from "react";
import { generateLivekitToken } from "../api/voice.api";
import { GenerateTokenData, VoiceState } from "../types/voice.types";

const useVoiceChat = () => {
    const [voiceState, setVoiceState] = useState<VoiceState>("hidden");
    const [sessionData, setSessionData] = useState<GenerateTokenData | null>(null);

    const generateTokenMutation = useMutation({
        mutationFn: generateLivekitToken,
    });


    const startSession = async () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
        setVoiceState("loading")
        const token = await generateTokenMutation.mutateAsync();
        const session = token.data;
        console.log("Generated LiveKit token:", session);
        setSessionData(session);
        setVoiceState("connecting");
    }

    return {
        startSession,
        voiceState,
        setVoiceState,
        sessionData,
    };

}

export default useVoiceChat;