import { LinearGradient } from "expo-linear-gradient";
import { ImagePlus, Mic, Send } from "lucide-react-native";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Platform,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { Colors, Radius, Spacing, Typography } from "@/constants/theme";

interface ChatInputRowProps {
  isGenerating: boolean;
  inputText: string;
  onTextChange: (text: string) => void;
  onMicPress: () => void;
  onImagePress: () => void;
  onSendPress: () => void;
}

const BTN_SIZE = 50;

export default function ChatInputRow({
  isGenerating,
  inputText,
  onTextChange,
  onMicPress,
  onImagePress,
  onSendPress,
}: ChatInputRowProps) {
  const { t } = useTranslation("common");
  const c = Colors.light;
  const [inputFocused, setInputFocused] = useState(false);

  return (
    <View style={styles.inputRow}>
      {/* Mic Button */}
      <TouchableOpacity
        onPress={onMicPress}
        style={[styles.iconBtn, isGenerating && { opacity: 0.5 }]}
        disabled={isGenerating}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={[c.primaryContainer, "#FFB77A"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.iconGradient}
        >
          <Mic size={22} color="#FFFFFF" fill="rgba(255, 255, 255, 0.25)" />
        </LinearGradient>
      </TouchableOpacity>

      {/* Image Button */}
      <TouchableOpacity
        onPress={onImagePress}
        style={[styles.iconBtn, isGenerating && { opacity: 0.5 }]}
        disabled={isGenerating}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={[c.primaryContainer, "#14B8A6"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.iconGradient}
        >
          <ImagePlus size={22} color="#FFFFFF" />
        </LinearGradient>
      </TouchableOpacity>

      {/* Text Input */}
      <View
        style={[
          styles.inputContainer,
          inputFocused && styles.inputContainerFocused,
        ]}
        collapsable={false}
      >
        <View style={styles.textInputArea} collapsable={false}>
          <TextInput
            placeholder={
              isGenerating ? t("chat.aiIsTyping") : t("chat.askQuestion")
            }
            placeholderTextColor={c.textMuted}
            value={inputText}
            onChangeText={onTextChange}
            onFocus={() => setInputFocused(true)}
            onBlur={() => setInputFocused(false)}
            style={styles.textInput}
            collapsable={false}
            editable={!isGenerating}
          />
        </View>
      </View>

      {/* Send Button */}
      <TouchableOpacity
        onPress={onSendPress}
        activeOpacity={0.85}
        style={[
          styles.sendButton,
          (inputText.length === 0 || isGenerating) &&
            styles.sendButtonDisabled,
        ]}
        disabled={inputText.length === 0 || isGenerating}
      >
        <LinearGradient
          colors={
            inputText.length > 0 && !isGenerating
              ? [c.primaryDark, c.primary]
              : [c.border, c.border]
          }
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.sendGradient}
        >
          <Send
            size={18}
            color={
              inputText.length > 0 && !isGenerating ? "#FFFFFF" : c.textMuted
            }
          />
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  iconBtn: {
    width: BTN_SIZE,
    height: BTN_SIZE,
    borderRadius: BTN_SIZE / 2,
    shadowColor: Colors.light.primaryContainer,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 3,
  },
  iconGradient: {
    width: BTN_SIZE,
    height: BTN_SIZE,
    borderRadius: BTN_SIZE / 2,
    alignItems: "center",
    justifyContent: "center",
  },
  inputContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.light.input,
    borderWidth: 1.5,
    borderColor: Colors.light.border,
    borderRadius: Radius.xl,
    paddingHorizontal: Spacing.md,
    minHeight: 52,
  },
  inputContainerFocused: {
    borderColor: Colors.light.primary,
    backgroundColor: "#FFFFFF",
    shadowColor: Colors.light.primary,
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 0 },
    elevation: 2,
  },
  textInput: {
    flex: 1,
    ...Typography.body,
    lineHeight: undefined,
    color: Colors.light.text,
    paddingVertical: Platform.OS === "ios" ? 0 : Spacing.sm,
  },
  textInputArea: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  sendButton: {
    borderRadius: BTN_SIZE / 2,
  },
  sendButtonDisabled: {
    opacity: 0.6,
  },
  sendGradient: {
    width: BTN_SIZE,
    height: BTN_SIZE,
    borderRadius: BTN_SIZE / 2,
    alignItems: "center",
    justifyContent: "center",
  },
});
