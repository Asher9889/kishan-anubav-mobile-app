
export type ChatMessageType = "reply" | "message" | "listening" | "uploading" | "thinking" | "generating";

export interface ChatMessage {
  id: string;
  role: "user" | "ai";
  type: ChatMessageType;
  content?: string;
  timestamp?: string;
}

export type TSheetHandle = {
  open: () => void;
  close: () => void;
  isOpen: boolean;
};
