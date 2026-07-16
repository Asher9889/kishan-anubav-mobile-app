import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { VoiceState } from "../types/voice.types";
import OrbStateLabel from "./orb/OrbStateLabel";
import VoiceOrb from "./orb/VoiceOrb";

type props = {
  state: VoiceState;
};

const OrbContainer = ({ state }: props) => {
  const insets = useSafeAreaInsets();

  return (
    <View
      className="absolute right-0 left-0 items-center"
      style={[{ bottom: insets.bottom + 52 }]}
    >
      <VoiceOrb state={state} />
      <OrbStateLabel state={state} />
    </View>
  );
};

export default OrbContainer;
