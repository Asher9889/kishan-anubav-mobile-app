import { useLocalParticipant, useVoiceAssistant } from "@livekit/react-native";
import { useCallback, useEffect, useRef } from "react";

const AUDIO_THRESHOLD = 0.08;
const DEBOUNCE_MS = 1000;

export default function BargeInDetector() {
  const { localParticipant } = useLocalParticipant();
  const { state: agentState } = useVoiceAssistant();
  const frameRef = useRef<number>(0);
  const lastSentRef = useRef(0);
  const sentRef = useRef(false);

  const sendInterrupt = useCallback(async () => {
    if (!localParticipant) return;

    const now = Date.now();
    if (now - lastSentRef.current < DEBOUNCE_MS) return;
    lastSentRef.current = now;

    try {
      await localParticipant.publishData(
        new TextEncoder().encode("interrupted"),
        { topic: "barge_in", reliable: true }
      );
    } catch (e) {
      console.error("BargeInDetector: failed to send interrupt", e);
    }
  }, [localParticipant]);

  useEffect(() => {
    if (agentState !== "speaking") {
      sentRef.current = false;
      return;
    }

    const poll = () => {
      const level = localParticipant?.audioLevel ?? 0;
      if (level > AUDIO_THRESHOLD && !sentRef.current) {
        sentRef.current = true;
        sendInterrupt();
      }
      frameRef.current = requestAnimationFrame(poll);
    };

    frameRef.current = requestAnimationFrame(poll);
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [agentState, localParticipant, sendInterrupt]);

  return null;
}
