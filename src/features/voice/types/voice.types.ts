
export type VoiceState =
  | "hidden"
  | "loading"
  | "connecting"
  | "connected"
  | "idle"
  | "listening"
  | "thinking"
  | "speaking"
  | "disconnected"
  | "error";

export type AgentVoiceState =
  | "idle"
  | "listening"
  | "thinking"
  | "speaking";

export interface NodeApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
}

export type GenerateTokenData = {
  token: string;
  roomName: string;
  livekitUrl: string;
};

