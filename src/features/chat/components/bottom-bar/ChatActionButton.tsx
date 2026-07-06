import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import Animated from "react-native-reanimated";

import { Colors } from "@/constants/theme";
import { BTN_SIZE, MENU_BTN_SIZE } from "./styles";

interface Props {
  onPress: () => void;

  children: React.ReactNode;

  colors: string[];

  disabled?: boolean;

  size?: "small" | "menu";

  animatedStyle?: any;
}

export default function ChatActionButton({
  onPress,
  children,
  colors,
  disabled = false,
  size = "small",
  animatedStyle,
}: Props) {
  const buttonSize =
    size === "menu"
      ? MENU_BTN_SIZE
      : BTN_SIZE;

  return (
    <Animated.View style={animatedStyle}>
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={onPress}
        disabled={disabled}
        style={[
          localStyles.button,
          {
            width: buttonSize,
            height: buttonSize,
            borderRadius: buttonSize / 2,
          },
          disabled && localStyles.disabled,
        ]}
      >
        <LinearGradient
          colors={colors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            width: buttonSize,
            height: buttonSize,
            borderRadius: buttonSize / 2,

            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {children}
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
}

const localStyles = StyleSheet.create({
  button: {
    shadowColor: Colors.light.primaryContainer,

    shadowOpacity: 0.25,

    shadowRadius: 6,

    shadowOffset: {
      width: 0,
      height: 3,
    },

    elevation: 3,
  },

  disabled: {
    opacity: 0.5,
  },
});