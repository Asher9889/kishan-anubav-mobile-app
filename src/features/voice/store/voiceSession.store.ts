import { create } from 'zustand';

/**
 * Local voice turn state — sourced from the recognizer and TTS instead of a
 * LiveKit agent participant:
 *
 *   listening → user speaks freely, recognizer is running (live caption is
 *               being written into the composer)
 *   thinking   → utterance committed, waiting for the first response delta
 *   speaking   → TTS is voicing the answer (recognizer is held)
 *
 * `phase === "speaking"` is the single source of truth the recognizer gates
 * on; `isConversationActive` toggles the whole voice mode (mic/orb button,
 * TTS subscription).
 */
export type VoiceTurnPhase = 'idle' | 'listening' | 'thinking' | 'speaking';

type VoiceTurnState = {
  phase: VoiceTurnPhase;
  isConversationActive: boolean;
  /** Interim words (live caption) while the user is speaking. */
  liveTranscript: string;
  /** Last finished utterance, consumed by the voice→composer bridge. */
  finalTranscript: string | null;
  /** Last fatal recognizer error code, shown in the composer for feedback. */
  voiceError: string | null;

  beginConversation: () => void;
  endConversation: () => void;
  transitionToListening: () => void;
  transitionToThinking: () => void;
  transitionToSpeaking: () => void;
  setLiveTranscript: (text: string) => void;
  resetTranscript: () => void;
  setFinalTranscript: (text: string) => void;
  clearFinalTranscript: () => void;
  setVoiceError: (code: string) => void;
  clearVoiceError: () => void;
};

export const useVoiceSessionStore = create<VoiceTurnState>((set) => ({
  phase: 'idle',
  isConversationActive: false,
  liveTranscript: '',
  finalTranscript: null,
  voiceError: null,

  beginConversation: () =>
    set({ isConversationActive: true, phase: 'listening', liveTranscript: '', finalTranscript: null, voiceError: null }),
  endConversation: () =>
    set({ isConversationActive: false, phase: 'idle', liveTranscript: '', finalTranscript: null, voiceError: null }),

  transitionToListening: () => set({ phase: 'listening' }),
  transitionToThinking: () => set({ phase: 'thinking' }),
  transitionToSpeaking: () => set({ phase: 'speaking' }),

  setLiveTranscript: (text) => set({ liveTranscript: text }),
  resetTranscript: () => set({ liveTranscript: '' }),

  setFinalTranscript: (text) => set({ finalTranscript: text, liveTranscript: '' }),
  clearFinalTranscript: () => set({ finalTranscript: null }),

  setVoiceError: (code) => set({ voiceError: code }),
  clearVoiceError: () => set({ voiceError: null }),
}));