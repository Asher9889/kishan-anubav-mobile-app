import {
  AndroidAudioTypePresets,
  AudioSession,
  LiveKitRoom,
} from "@livekit/react-native";
import { useCallback, useEffect, useRef, useState } from "react";
import { ActivityIndicator, Platform, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { GenerateTokenData, VoiceState } from "../types/voice.types";
import MicDebug from "./orb/MicDebug";
import OrbContainer from "./OrbContainer";

type Props = {
  session: GenerateTokenData | null;
  voiceState: VoiceState;
  onConnected: () => void;
};

export default function VoiceSessionController({
  session,
  voiceState,
  onConnected,
}: Props) {
  const insets = useSafeAreaInsets();
  const [micEnabled, setMicEnabled] = useState(false);
  const micTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleConnected = useCallback(() => {
    onConnected();
    micTimerRef.current = setTimeout(() => setMicEnabled(true), 400);
    console.log("VoiceSessionController: connected, enabling mic after delay");
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
  // const options = {
  //   noiseSuppression: true,
  //   echoCancellation: true,
  //   restrictOwnAudio: true,
  //   voiceIsolation: true,
  // }

  return (
    <LiveKitRoom
      serverUrl={session?.livekitUrl}
      token={session?.token}
      connect={true}
      audio={true}
      onConnected={handleConnected}
      onError={(error) => console.error("LiveKit error:", error)}
    >
      {/* <LivekitController /> */}
      <MicDebug />
      <OrbContainer state={voiceState} />
    </LiveKitRoom>
  );
}
