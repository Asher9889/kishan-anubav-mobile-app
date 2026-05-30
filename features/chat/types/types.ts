
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

export type StreamHandlers = {
  onMetadata?: (data: { thread_id: string, query: string }) => void;
  onStart?: () => void;
  onChunk?: (data: { content: string }) => void;
  onComplete?: (data: any) => void;
  onError?: (error: unknown) => void;
};

export type TranscriptionResponse = {
  "success": boolean,
  "message": string,
  "data": {
    "transcript": string,
    "language": "hi" | "en",
    "confidence": number
  }
}