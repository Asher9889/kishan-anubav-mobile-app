// import { rive } from "@/assets";
import { Fit, RiveView, useRiveFile } from "@rive-app/react-native";
import React from "react";
import { StyleProp, ViewStyle } from "react-native";
import { VoiceState } from "../types/voice.types";



interface OrbProps {
    state: VoiceState;
    size?: number;
    style?: StyleProp<ViewStyle>;
}

function Orb({state, size = 220, style}: OrbProps) {

    const { riveFile } = useRiveFile(require("@/assets/rive/orb1.riv"));

    if (!riveFile) {
        return null;
    }

    console.log("Orb State:", state);

    return (
        <RiveView
            fit={Fit.Contain}
            file={riveFile}
            onError={(error) => console.error('Rive error:', error.message)}
            style={[
                {
                    width: size,
                    height: size,
                },
                style,
            ]}
        />
    );
}

export default Orb;