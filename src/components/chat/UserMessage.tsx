import React from "react";
import { Text, View } from "react-native";

import ChatMarkdown from "@/features/chat/components/chat-markdown";
import { ChatMessage } from "@/features/chat/types/types";

import { styles } from "./styles";

interface Props {
  message: ChatMessage;
}

export default function UserMessage({
  message,
}: Props) {

    console.log("UserMessage", message)
  return (
    <View style={[styles.row, styles.userRow]}>
      <View style={styles.userBubble}>
        <ChatMarkdown
          content={message.content ?? ""}
          isUser
        />
      </View>

      {message.timestamp && (
        <View style={styles.userFooter}>
          <Text style={styles.timestamp}>
            {message.timestamp}
          </Text>
        </View>
      )}
    </View>
  );
}