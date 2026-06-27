import { EnvConfig } from "./types";

const envConfig: EnvConfig = {
  nodeApiBaseUrl: process.env.EXPO_PUBLIC_NODE_API_BASE_URL!,
  aiApiBaseUrl: process.env.EXPO_PUBLIC_AI_API_BASE_URL!
};

export default envConfig;