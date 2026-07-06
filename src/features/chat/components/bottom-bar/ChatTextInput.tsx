import React from "react";
import { useTranslation } from "react-i18next";
import { TextInput } from "react-native";

import { Colors } from "@/constants/theme";
import { styles } from "./styles";

interface Props {
  value: string;
  isGenerating: boolean;
  onChangeText: (text: string) => void;
  onFocus: () => void;
  onBlur: () => void;
}

export default function ChatTextInput({
  value,
  isGenerating,
  onChangeText,
  onFocus,
  onBlur,
}: Props) {
  const { t } = useTranslation("common");

  return (
    <TextInput
      value={value}
      editable={!isGenerating}
      multiline
      maxLength={2000}
      placeholder={
        isGenerating
          ? t("chat.aiIsTyping")
          : t("chat.askQuestion")
      }
      placeholderTextColor={Colors.light.textMuted}
      style={styles.textInput}
      onChangeText={onChangeText}
      onFocus={onFocus}
      onBlur={onBlur}
      returnKeyType="send"
      blurOnSubmit={false}
      textAlignVertical="center"
    />
  );
}