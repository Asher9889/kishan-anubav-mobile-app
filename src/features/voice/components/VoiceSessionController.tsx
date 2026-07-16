import { AndroidAudioTypePresets, AudioSession, LiveKitRoom } from "@livekit/react-native";
import { useCallback, useEffect } from "react";
import { ActivityIndicator, Platform, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import type { AudioCaptureOptions } from "livekit-client";
import { GenerateTokenData, VoiceState } from "../types/voice.types";
import ManageLivekitRoom from "./ManageLivekitRoom";
import MicDebug from "./orb/MicDebug";
import OrbContainer from "./OrbContainer";

type Props = {
  session: GenerateTokenData | null;
  voiceState: VoiceState;
  onConnected: () => void;
  onError?: (reason: string) => void;
};

export default function VoiceSessionController({ session, voiceState, onConnected, onError }: Props) {
  const insets = useSafeAreaInsets();

  const audioCaptureOptions: AudioCaptureOptions = {
    echoCancellation: true,
    noiseSuppression: true,
    autoGainControl: true,
    voiceIsolation: true,
  };

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
          preferredOutputList: ["speaker", "earpiece", "headset", "bluetooth"],
          audioTypeOptions: AndroidAudioTypePresets.communication,
        },
      });
    }
  }, []);

  useEffect(() => {
    if (session) configureAudio();
  }, [session, configureAudio]);

  if (voiceState === "hidden" && !session) return null;

  if (voiceState === "loading") {
    return (
      <View className="absolute right-0 left-0 items-center" style={[{ bottom: insets.bottom + 56 }]}>
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
      onError={() => onError?.("connection_failed")}
    >
      <ManageLivekitRoom onReady={onConnected} onError={onError} />
      <MicDebug />
      <OrbContainer state={voiceState} />
    </LiveKitRoom>
  );
}
