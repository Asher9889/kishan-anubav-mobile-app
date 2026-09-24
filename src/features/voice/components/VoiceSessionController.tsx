import { AndroidAudioTypePresets, AudioSession, LiveKitRoom, useConnectionState } from "@livekit/react-native";
import { ConnectionState } from "livekit-client";
import { useCallback, useEffect, useRef, useState } from "react";
import { ActivityIndicator, Platform, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import type { AudioCaptureOptions } from "livekit-client";
import { useVoiceTts } from "../hooks/useVoiceTts";
import { useVoiceSessionStore } from "../store/voiceSession.store";
import { AgentVoiceState, GenerateTokenData, VoiceState } from "../types/voice.types";
import { type ProcessingFlags } from "./AudioDebugBar";
import LocalTranscriber from "./LocalTranscriber";
import OrbContainer from "./OrbContainer";

type Props = {
  session: GenerateTokenData | null;
  voiceState: VoiceState;
  onConnected: () => void;
  onError?: (reason: string) => void;
  onAgentStateChange?: (state: AgentVoiceState) => void;
  onRetry?: () => void;
  onUserUtterance?: (text: string) => void;
};

const DEFAULT_FLAGS: ProcessingFlags = {
  echoCancellation: true,
  noiseSuppression: true,
  autoGainControl: true,
  voiceIsolation: true,
};

const CAPTURE_SAMPLE_RATE = 48000;

/**
 * Media is intentionally NOT published anymore: the mic only feeds the
 * on-device recognizer, and a lightweight backend receives the text via the
 * normal `/v3/ask` path. LiveKit is kept purely as the session/presence
 * channel that powers the orb. Flip to `true` to re-enable live audio
 * straight into the room.
 */
const PUBLISH_LOCAL_AUDIO = false;

/** Signals the moment the LiveKit room is actually connected. */
function RoomConnectionProbe({ onConnected }: { onConnected: () => void }) {
  const connectionState = useConnectionState();
  const firedRef = useRef(false);

  useEffect(() => {
    if (connectionState === ConnectionState.Connected && !firedRef.current) {
      firedRef.current = true;
      onConnected();
    }
  }, [connectionState, onConnected]);

  return null;
}

export default function VoiceSessionController({ session, voiceState, onConnected, onError, onRetry, onUserUtterance }: Props) {
  const insets = useSafeAreaInsets();

  const phase = useVoiceSessionStore((state) => state.phase);
  const beginConversation = useVoiceSessionStore((state) => state.beginConversation);
  const endConversation = useVoiceSessionStore((state) => state.endConversation);

  const [processingFlags] = useState<ProcessingFlags>(DEFAULT_FLAGS);

  const sessionActive = !!session;

  useVoiceTts({ enabled: sessionActive });

  const audioCaptureOptions: AudioCaptureOptions = {
    ...processingFlags,
    sampleRate: CAPTURE_SAMPLE_RATE,
  };

  const captureKey = [
    processingFlags.echoCancellation,
    processingFlags.noiseSuppression,
    processingFlags.autoGainControl,
    processingFlags.voiceIsolation,
  ].join("-");

  const configureAudio = useCallback(async () => {
    if (Platform.OS === "ios") {
      await AudioSession.setAppleAudioConfiguration({
        audioCategory: "playAndRecord",
        audioCategoryOptions: ["allowBluetooth", "defaultToSpeaker"],
        audioMode: "videoChat",
      });
    } else if (Platform.OS === "android") {
      await AudioSession.configureAudio({
        android: {
          preferredOutputList: ["speaker"],
          audioTypeOptions: AndroidAudioTypePresets.communication,
        },
      });
    }
  }, []);

  useEffect(() => {
    if (session) configureAudio();
  }, [session, configureAudio]);

  useEffect(() => {
    if (!sessionActive) endConversation();
  }, [sessionActive, endConversation]);

  const handleRoomConnected = useCallback(() => {
    beginConversation();
    onConnected?.();
  }, [beginConversation, onConnected]);

  if (voiceState === "hidden" && !session) return null;

  if (voiceState === "loading") {
    return (
      <View className="absolute right-0 left-0 items-center" style={[{ bottom: insets.bottom + 56 }]}>
        <ActivityIndicator size="small" />
      </View>
    );
  }

  // Once the room is connected the orb follows the local voice turn phase
  // (listening → thinking → speaking) instead of agent state.
  const orbState: VoiceState =
    voiceState === "connecting" || voiceState === "error"
      ? voiceState
      : phase;

  return (
    <LiveKitRoom
      key={captureKey}
      serverUrl={session?.livekitUrl}
      token={session?.token}
      connect={true}
      audio={PUBLISH_LOCAL_AUDIO ? audioCaptureOptions : false}
      onError={() => onError?.("connection_failed")}
    >
      <RoomConnectionProbe onConnected={handleRoomConnected} />
      <LocalTranscriber onUserUtterance={onUserUtterance} />
      <OrbContainer state={orbState} onRetry={onRetry} />
    </LiveKitRoom>
  );
}