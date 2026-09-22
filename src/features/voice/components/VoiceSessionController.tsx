import { AndroidAudioTypePresets, AudioSession, LiveKitRoom } from "@livekit/react-native";
import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Platform, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import type { AudioCaptureOptions } from "livekit-client";
import type { LocalMicDumpResult } from "../debug/localMicDump";
import { AgentVoiceState, GenerateTokenData, VoiceState } from "../types/voice.types";
import { type ProcessingFlags } from "./AudioDebugBar";
import BargeInDetector from "./BargeInDetector";
import ManageLivekitRoom from "./ManageLivekitRoom";
import OrbContainer from "./OrbContainer";

type Props = {
  session: GenerateTokenData | null;
  voiceState: VoiceState;
  onConnected: () => void;
  onError?: (reason: string) => void;
  onAgentStateChange?: (state: AgentVoiceState) => void;
  onRetry?: () => void;
};

const DEFAULT_FLAGS: ProcessingFlags = {
  echoCancellation: true,
  noiseSuppression: true,
  autoGainControl: true,
  voiceIsolation: true,
};

const CAPTURE_SAMPLE_RATE = 48000;

export default function VoiceSessionController({ session, voiceState, onConnected, onError, onAgentStateChange, onRetry }: Props) {
  const insets = useSafeAreaInsets();

  const [processingFlags, setProcessingFlags] = useState<ProcessingFlags>(DEFAULT_FLAGS);
  // const [recordArmed, setRecordArmed] = useState(false);
  // const [dumpActive, setDumpActive] = useState(false);
  const [lastDump, setLastDump] = useState<LocalMicDumpResult | null>(null);

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

  // const handleDumpSaved = useCallback((result: LocalMicDumpResult) => {
  //   setLastDump(result);
  //   console.log(
  //     `[MIC DUMP] saved ${result.fileName} (${result.sampleRate}Hz, ${result.durationMs}ms, ${result.bytes} bytes) → ${result.uri}`
  //   );
  // }, []);

  if (voiceState === "hidden" && !session) return null;

  if (voiceState === "loading") {
    return (
      <View className="absolute right-0 left-0 items-center" style={[{ bottom: insets.bottom + 56 }]}>
        <ActivityIndicator size="small" />
      </View>
    );
  }

  return (
    <>
      <LiveKitRoom
        key={captureKey}
        serverUrl={session?.livekitUrl}
        token={session?.token}
        connect={true}
        audio={audioCaptureOptions}
        onError={() => onError?.("connection_failed")}
      >
        <ManageLivekitRoom
          onReady={onConnected}
          onError={onError}
          onAgentStateChange={onAgentStateChange}
        />
        <OrbContainer state={voiceState} onRetry={onRetry} />
        <BargeInDetector />
      
      </LiveKitRoom>
    </>
  );
}
