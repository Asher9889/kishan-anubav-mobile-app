import { useMutation } from "@tanstack/react-query";
import * as Haptics from "expo-haptics";
import { useCallback, useMemo, useRef, useState } from "react";
import { generateLivekitToken } from "../api/voice.api";
import { AgentVoiceState, GenerateTokenData, VoiceState } from "../types/voice.types";

const useVoiceSession = () => {
  const [voiceState, setVoiceState] = useState<VoiceState>("hidden");
  const [agentState, setAgentState] = useState<AgentVoiceState | null>(null);
  const [sessionData, setSessionData] = useState<GenerateTokenData | null>(null);
  const errorFiredRef = useRef(false);

  const generateTokenMutation = useMutation({
    mutationFn: generateLivekitToken,
  });

  const startSession = async () => {
    errorFiredRef.current = false;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
    setVoiceState("loading");
    const token = await generateTokenMutation.mutateAsync();
    const session = token.data;
    setSessionData(session);
    setVoiceState("connecting");
  };

  const stopSession = useCallback(() => {
    setSessionData(null);
    setVoiceState("hidden");
    setAgentState(null);
    errorFiredRef.current = false;
  }, []);

  const handleConnected = useCallback(() => {
    errorFiredRef.current = false;
    setVoiceState("connected");
  }, []);

  const handleError = useCallback(
    (reason: string) => {
      if (errorFiredRef.current) return;
      errorFiredRef.current = true;
      console.warn("Voice session error:", reason);
      setVoiceState("error");
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    },
    []
  );

  const handleAgentStateChange = useCallback((state: AgentVoiceState) => {
    setAgentState(state);
  }, []);

  const unifiedState: VoiceState = useMemo(() => {
    if (voiceState === "error" || voiceState === "hidden" || voiceState === "loading" || voiceState === "connecting") {
      return voiceState;
    }
    if (agentState) return agentState;
    return voiceState;
  }, [voiceState, agentState]);

  return {
    startSession,
    stopSession,
    voiceState: unifiedState,
    rawVoiceState: voiceState,
    agentState,
    sessionData,
    handleConnected,
    handleError,
    handleAgentStateChange,
  };
};

export default useVoiceSession;
