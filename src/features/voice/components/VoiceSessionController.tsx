import {
  AndroidAudioTypePresets,
  AudioSession,
  LiveKitRoom,
  useLocalParticipant,
  useVoiceAssistant,
} from "@livekit/react-native";
import { useCallback, useEffect, useRef, useState } from "react";
import { ActivityIndicator, Platform, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import type { AudioCaptureOptions } from "livekit-client";
import { GenerateTokenData, VoiceState } from "../types/voice.types";
import MicDebug from "./orb/MicDebug";
import OrbContainer from "./OrbContainer";

type Props = {
  session: GenerateTokenData | null;
  voiceState: VoiceState;
  onConnected: () => void;
};

const BARGE_IN_THRESHOLD = 0.35;

function MicToggle({
  enabled,
  captureOptions,
}: {
  enabled: boolean;
  captureOptions: AudioCaptureOptions;
}) {
  const { localParticipant } = useLocalParticipant();
  const { state: agentState } = useVoiceAssistant();
  const isAgentSpeaking = agentState === "speaking";
  const frameRef = useRef<number>(0);
  const bargeInRef = useRef(false);

  useEffect(() => {
    if (!localParticipant || !enabled) {
      bargeInRef.current = false;
      return;
    }

    if (!isAgentSpeaking) {
      bargeInRef.current = false;
      localParticipant.setMicrophoneEnabled(true, captureOptions);
      return;
    }

    localParticipant.setMicrophoneEnabled(false);

    const poll = () => {
      const level = localParticipant?.audioLevel ?? 0;
      if (level > BARGE_IN_THRESHOLD && !bargeInRef.current) {
        bargeInRef.current = true;
        localParticipant.setMicrophoneEnabled(true, captureOptions);
        return;
      }
      frameRef.current = requestAnimationFrame(poll);
    };

    frameRef.current = requestAnimationFrame(poll);
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [localParticipant, enabled, isAgentSpeaking, captureOptions]);

  return null;
}

export default function VoiceSessionController({
  session,
  voiceState,
  onConnected,
}: Props) {
  const insets = useSafeAreaInsets();

  const audioCaptureOptions: AudioCaptureOptions = {
    echoCancellation: true,
    noiseSuppression: true,
    autoGainControl: true,
    voiceIsolation: true,
  };

  const [micEnabled, setMicEnabled] = useState(false);
  const micTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleConnected = useCallback(() => {
    onConnected();
    micTimerRef.current = setTimeout(() => setMicEnabled(true), 400);
  }, [onConnected]);

  useEffect(() => {
    return () => {
      if (micTimerRef.current) clearTimeout(micTimerRef.current);
    };
  }, []);

  const configureAudio = useCallback(async () => {
    if (Platform.OS === "ios") {
      console.log("Configuring iOS audio session");
      await AudioSession.setAppleAudioConfiguration({
        audioCategory: "playAndRecord",
        audioCategoryOptions: [
          "allowBluetooth",
          "mixWithOthers",
          "defaultToSpeaker",
        ],
        audioMode: "videoChat",
      });
    } else if (Platform.OS === "android") {
      console.log("Configuring Android audio session");
      await AudioSession.configureAudio({
        android: {
          preferredOutputList: ["speaker", "earpiece", "headset", "bluetooth"],
          audioTypeOptions: AndroidAudioTypePresets.communication,
        },
      });
    }
  }, []);

  useEffect(() => {
    if (session) {
      configureAudio();
    }
  }, [session, configureAudio]);

  if (voiceState === "hidden" && !session) return null;

  if (voiceState === "loading") {
    return (
      <View
        className="absolute right-0 left-0 items-center"
        style={[{ bottom: insets.bottom + 56 }]}
      >
        <ActivityIndicator size="small" />
      </View>
    );
  }

  return (
    <LiveKitRoom
      serverUrl={session?.livekitUrl}
      token={session?.token}
      connect={true}
      audio={audioCaptureOptions}
      onConnected={handleConnected}
      onError={(error) => console.error("LiveKit error:", error)}
    >
      <MicToggle enabled={micEnabled} captureOptions={audioCaptureOptions} />
      <MicDebug />
      <OrbContainer state={voiceState} />
    </LiveKitRoom>
  );
}
