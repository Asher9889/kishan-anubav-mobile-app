import {
  BlurMask,
  Circle,
} from "@shopify/react-native-skia";
import React from "react";

interface Props {
  cx: number;
  cy: number;
  radius: number;
}

export default function OrbGlow({
  cx,
  cy,
  radius,
}: Props) {
  return (
    <Circle
      cx={cx}
      cy={cy}
      r={radius}
      color="rgba(59,130,246,0.25)"
    >
      <BlurMask blur={45} />
    </Circle>
  );
}