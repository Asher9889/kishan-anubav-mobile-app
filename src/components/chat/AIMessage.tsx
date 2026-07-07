import React from "react";
import {
    Text,
    View,
} from "react-native";

import ChatMarkdown from "@/features/chat/components/chat-markdown";
import { ChatMessage } from "@/features/chat/types/types";

import AIAvatar from "./AIAvatar";
import MessageActions from "./MessageActions";
import { styles } from "./styles";

interface Props {
  message: ChatMessage;

  isStreaming?: boolean;

  onCopy?: () => void;
  onSpeak?: () => void;
  onLike?: () => void;
  onDislike?: () => void;
}

export default function AIMessage({
  message,
  isStreaming = false,
  onCopy,
  onSpeak,
  onLike,
  onDislike,
}: Props) {
  return (
    <View style={[styles.row, styles.aiRow]}>
      {/* Header */}

      <View style={styles.aiHeader}>
        <AIAvatar />

        <View style={styles.aiTitleContainer}>
          <Text style={styles.aiName}>
            Krishi AI
          </Text>

          <Text style={styles.aiStatus}>
            {isStreaming
              ? "Thinking..."
              : "Assistant"}
          </Text>
        </View>
      </View>

      {/* Markdown */}

      <View style={styles.aiContent}>
        <ChatMarkdown
          content={message.content ?? ""}
          isUser={false}
        />
      </View>

      {/* Footer */}

      {!isStreaming && (
        <View style={styles.aiFooter}>
          <MessageActions
            onCopy={onCopy}
            onSpeak={onSpeak}
            onLike={onLike}
            onDislike={onDislike}
          />
        </View>
      )}
    </View>
  );
}