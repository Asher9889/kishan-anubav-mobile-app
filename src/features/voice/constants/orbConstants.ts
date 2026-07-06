export type OrbState = "idle" | "userSpeaking" | "aiSpeaking";

export const ORB_SIZE = 260;
export const ORB_CANVAS_PADDING = 140;
export const ORB_CANVAS_SIZE = ORB_SIZE + ORB_CANVAS_PADDING * 2;
export const ORB_CENTER = ORB_CANVAS_SIZE / 2;
export const ORB_RADIUS = ORB_SIZE / 2;

export const BACKGROUND_COLOR = "#050608";
export const BACKGROUND_VIGNETTE = "#000000";

export const CORE_COLOR_INNER = "#EAF3FF";
export const CORE_COLOR_OUTER = "#7FB4FF";
export const SHELL_COLOR = "#3D6BFF";
export const AURA_COLOR = "#1E3AFF";
export const GLOW_COLOR = "#4E8BFF";

export const STATE_CONFIG = {
  idle: {
    breathSpeed: 5200,
    breathAmplitude: 0.035,
    deform: 0.02,
    ripple: 0.0,
    glow: 0.55,
    rotation: 0.15,
    waveEmit: 0.0,
  },
  userSpeaking: {
    breathSpeed: 1400,
    breathAmplitude: 0.09,
    deform: 0.12,
    ripple: 0.9,
    glow: 0.95,
    rotation: 0.6,
    waveEmit: 0.0,
  },
  aiSpeaking: {
    breathSpeed: 2600,
    breathAmplitude: 0.06,
    deform: 0.06,
    ripple: 0.0,
    glow: 0.85,
    rotation: 1.0,
    waveEmit: 1.0,
  },
} as const;

export const TRANSITION_DURATION = 1200;