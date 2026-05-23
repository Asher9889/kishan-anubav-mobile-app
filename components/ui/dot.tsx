import { useEffect, useRef } from "react";

import {
    Animated
} from "react-native";

import { Colors } from "@/constants/theme";

const c = Colors.light;

function Dot({ delay }: { delay: number }) {
    const scale = useRef(new Animated.Value(0.5)).current;

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.delay(delay),

                Animated.timing(scale, {
                    toValue: 1,
                    duration: 400,
                    useNativeDriver: true,
                }),

                Animated.timing(scale, {
                    toValue: 0.5,
                    duration: 400,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    }, []);

    return (
        <Animated.View
            style={{
                width: 8,
                height: 8,
                borderRadius: 999,

                backgroundColor: c.primary,

                marginRight: 6,

                transform: [{ scale }],
            }}
        />
    );
}


export default Dot;