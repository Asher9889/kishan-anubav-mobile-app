import Animated, {
  useAnimatedStyle,
} from "react-native-reanimated";

import useVoiceOrb from "../../hooks/useVoiceOrb";
import { VoiceState } from "../../types/voice.types";
import OrbCanvas from "./OrbCanvas";

type Props = {
  state: VoiceState;
  size?: number;
};

export default function VoiceOrb({
  state,
  size = 220,
}: Props) {
  const animation = useVoiceOrb(state);

  const style = useAnimatedStyle(() => ({
    transform: [
      {
        scale: animation.scale.value,
      },
    ],
  }));

  return (
    <Animated.View style={[style, { backgroundColor: 'transparent' }]}>
      <OrbCanvas state={state} />
    </Animated.View>
  );
}