import { useAui } from '@assistant-ui/react-native';
import { useEffect } from 'react';

import { useVoiceTts } from '../hooks/useVoiceTts';
import { useVoiceSessionStore } from '../store/voiceSession.store';

/**
 * Glues the voice recognizer to the assistant-ui composer using only
 * fine-grained store primitives (`useAui`).
 *
 * While the user is talking, every interim word is pushed into the composer
 * so the text is visible in the UI the moment it is recognised. When an
 * utterance finishes, it is committed through the same composer — becoming a
 * regular user message whose answer streams in via the chat adapter while
 * `useVoiceTts` voices the same delta feed.
 *
 * This component must live inside the `AssistantRuntimeProvider`.
 */
export default function VoiceTurnController() {
  const aui = useAui();

  const isConversationActive = useVoiceSessionStore((state) => state.isConversationActive);
  const phase = useVoiceSessionStore((state) => state.phase);
  const liveTranscript = useVoiceSessionStore((state) => state.liveTranscript);
  const finalTranscript = useVoiceSessionStore((state) => state.finalTranscript);

  const transitionToThinking = useVoiceSessionStore((state) => state.transitionToThinking);
  const clearFinalTranscript = useVoiceSessionStore((state) => state.clearFinalTranscript);

  // Only voice the answers while a voice conversation is live; plain text
  // chat stays silent.
  useVoiceTts({ enabled: isConversationActive });

  // Live caption: reflect the recognised words straight into the composer.
  useEffect(() => {
    if (phase === 'listening' && liveTranscript) {
      aui.composer.setText(liveTranscript);
    }
  }, [phase, liveTranscript, aui]);

  // Commit: once the recognizer signals a finished utterance, put the exact
  // final text into the composer and send it. The adapter then streams the
  // answer into the thread while TTS voices it.
  useEffect(() => {
    if (!finalTranscript) return;
    transitionToThinking();
    aui.composer.setText(finalTranscript);
    void aui.composer.send();
    clearFinalTranscript();
  }, [finalTranscript, aui, transitionToThinking, clearFinalTranscript]);

  return null;
}