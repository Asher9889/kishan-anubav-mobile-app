import {
  Canvas,
  RadialGradient,
  Rect,
  vec,
} from "@shopify/react-native-skia";
import React, { memo, useMemo } from "react";
import { View, useWindowDimensions } from "react-native";
import { VoiceOrb } from "../components/VoiceOrb";
import type { OrbState } from "../constants/orbConstants";
import { screenStyles } from "../styles/styles";

type Props = {
  state?: OrbState;
};

const VoiceScreenComponent: React.FC<Props> = ({ state = "idle" }) => {
  const { width, height } = useWindowDimensions();

  const gradient = useMemo(
    () => ({
      center: vec(width / 2, height / 2),
      radius: Math.max(width, height) * 0.9,
    }),
    [width, height],
  );

  return (
    <View style={screenStyles.root}>
      <Canvas style={screenStyles.backdrop}>
        <Rect x={0} y={0} width={width} height={height}>
          <RadialGradient
            c={gradient.center}
            r={gradient.radius}
            colors={["#0B0F1A", "#05060A", "#000000"]}
            positions={[0.0, 0.6, 1.0]}
          />
        </Rect>
      </Canvas>
      <View style={screenStyles.orbContainer}>
        <VoiceOrb state={state} />
      </View>
    </View>
  );
};

export const VoiceScreen = memo(VoiceScreenComponent);
export default VoiceScreen;