import { useVoiceAssistant } from "@livekit/react-native";
import * as Haptics from "expo-haptics";
import { useCallback, useEffect, useRef } from "react";
import { AgentVoiceState } from "../types/voice.types";

const AGENT_TIMEOUT_MS = 15_000;

type Props = {
  onReady?: () => void;
  onError?: (reason: string) => void;
  onAgentStateChange?: (state: AgentVoiceState) => void;
};

const ManageLivekitRoom = ({ onReady, onError, onAgentStateChange }: Props) => {
  const { state } = useVoiceAssistant();
  const didReadyRef = useRef(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleReady = useCallback(() => {
    if (didReadyRef.current) return;
    didReadyRef.current = true;
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    onReady?.();
  }, [onReady]);

  useEffect(() => {
    if (state === "listening") handleReady();
  }, [state, handleReady]);

  useEffect(() => {
    if (state === "idle" || state === "listening" || state === "thinking" || state === "speaking") {
      onAgentStateChange?.(state);
    }
  }, [state, onAgentStateChange]);

  useEffect(() => {
    timeoutRef.current = setTimeout(() => {
      if (!didReadyRef.current) onError?.("agent_init_timeout");
    }, AGENT_TIMEOUT_MS);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [onError]);

  return null;
};

export default ManageLivekitRoom;
