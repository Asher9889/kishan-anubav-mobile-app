import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { VoiceState } from "../types/voice.types";
import OrbStateLabel from "./orb/OrbStateLabel";
import VoiceOrb from "./orb/VoiceOrb";
import WaveAnimation from "./orb/WaveAnimation";

type props = {
  state: VoiceState;
  onRetry?: () => void;
};

const OrbContainer = ({ state, onRetry }: props) => {
  const insets = useSafeAreaInsets();

  return (
    <View
      className="absolute right-0 left-0 items-center"
      style={[{ bottom: insets.bottom + 52 }]}
    >
      <VoiceOrb state={state} />
      {state === "listening" && <WaveAnimation />}
      <OrbStateLabel state={state} onRetry={onRetry} />
    </View>
  );
};

export default OrbContainer;
