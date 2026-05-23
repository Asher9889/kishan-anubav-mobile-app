export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  type: "message" | "thinking" | "uploading" | "error" | "listening";
  content?: string;
  timestamp?: string;
}