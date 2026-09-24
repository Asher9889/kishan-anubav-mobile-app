import { FontFamily } from "@/constants/fonts";
import { Colors } from "@/constants/theme";
import { Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useVoiceSessionStore } from "../store/voiceSession.store";
import { VoiceState } from "../types/voice.types";
import EnergyBar from "./orb/EnergyBar";
import OrbStateLabel from "./orb/OrbStateLabel";
import VoiceOrb from "./orb/VoiceOrb";

type props = {
  state: VoiceState;
  onRetry?: () => void;
};

const OrbContainer = ({ state, onRetry }: props) => {
  const insets = useSafeAreaInsets();
  const liveTranscript = useVoiceSessionStore((store) => store.liveTranscript);

  const showLiveTranscript = state === "listening" && liveTranscript.length > 0;

  return (
    <View
      className="absolute right-0 left-0 items-center"
      style={[{ bottom: insets.bottom + 52 }]}
    >
      <VoiceOrb state={state} />
      {/* <HorizontalBarVisualizer /> */}
      <EnergyBar />
      <OrbStateLabel state={state} onRetry={onRetry} />

      {showLiveTranscript && (
        <Text
          numberOfLines={2}
          style={{
            marginTop: 6,
            paddingHorizontal: 32,
            fontFamily: FontFamily.medium,
            fontSize: 13,
            lineHeight: 18,
            color: Colors.light.textSecondary,
            textAlign: "center",
            letterSpacing: 0.3,
          }}
        >
          {liveTranscript}
        </Text>
      )}
    </View>
  );
};

export default OrbContainer;
