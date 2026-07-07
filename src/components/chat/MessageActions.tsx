import React from "react";
import {
    Pressable,
    StyleSheet,
    View,
} from "react-native";

import {
    Copy,
    ThumbsDown,
    ThumbsUp,
    Volume2,
} from "lucide-react-native";

import {
    Colors,
    Radius,
    Spacing,
} from "@/constants/theme";

interface Props {
  onCopy?: () => void;
  onSpeak?: () => void;
  onLike?: () => void;
  onDislike?: () => void;

  disabled?: boolean;
}

function ActionButton({
  children,
  onPress,
  disabled,
}: {
  children: React.ReactNode;
  onPress?: () => void;
  disabled?: boolean;
}) {
  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        pressed && styles.buttonPressed,
      ]}
    >
      {children}
    </Pressable>
  );
}

export default function MessageActions({
  onCopy,
  onSpeak,
  onLike,
  onDislike,
  disabled = false,
}: Props) {
  return (
    <View style={styles.container}>
      <ActionButton
        onPress={onCopy}
        disabled={disabled}
      >
        <Copy
          size={18}
          color={Colors.light.textSecondary}
        />
      </ActionButton>

      <ActionButton
        onPress={onSpeak}
        disabled={disabled}
      >
        <Volume2
          size={18}
          color={Colors.light.textSecondary}
        />
      </ActionButton>

      <ActionButton
        onPress={onLike}
        disabled={disabled}
      >
        <ThumbsUp
          size={18}
          color={Colors.light.textSecondary}
        />
      </ActionButton>

      <ActionButton
        onPress={onDislike}
        disabled={disabled}
      >
        <ThumbsDown
          size={18}
          color={Colors.light.textSecondary}
        />
      </ActionButton>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: Spacing.sm,
    gap: Spacing.sm,
  },

  button: {
    width: 34,
    height: 34,

    borderRadius: Radius.full,

    alignItems: "center",
    justifyContent: "center",
  },

  buttonPressed: {
    backgroundColor: Colors.light.primaryMuted,
  },
});