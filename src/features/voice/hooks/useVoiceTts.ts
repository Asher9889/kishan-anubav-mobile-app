import * as Speech from 'expo-speech';
import { useCallback, useEffect, useRef } from 'react';

import { pushSpeechText } from '../services/speechChunking';
import { voiceStreamBridge } from '../services/voiceStreamBridge';
import { useVoiceSessionStore } from '../store/voiceSession.store';

const DEFAULT_SPEECH_LANGUAGE = 'hi-IN';
const DEFAULT_SPEECH_RATE = 1.0;
const DEFAULT_SPEECH_PITCH = 1.0;
const MAX_UTTERANCE_CHARS = 400;

export type UseVoiceTtsOptions = {
  /** Speak only while a voice session is live. Off for text-only chat. */
  enabled?: boolean;
  language?: string;
  rate?: number;
  pitch?: number;
};

/**
 * Speaks the chat response out loud, in sync with the text streaming into
 * the thread. The chat adapter publishes text deltas through
 * `voiceStreamBridge`; this hook buffers them into sentences (see
 * `pushSpeechText`) and hands whole sentences to the native TTS engine.
 *
 * Phase transitions:
 *   first utterance enqueued  → "speaking"
 *   every utterance done      → "listening" once the stream ended
 */
export function useVoiceTts({
  enabled = true,
  language = DEFAULT_SPEECH_LANGUAGE,
  rate = DEFAULT_SPEECH_RATE,
  pitch = DEFAULT_SPEECH_PITCH,
}: UseVoiceTtsOptions = {}) {
  const transitionToSpeaking = useVoiceSessionStore((state) => state.transitionToSpeaking);
  const transitionToListening = useVoiceSessionStore((state) => state.transitionToListening);

  const pendingTextRef = useRef('');
  const queuedUtterancesRef = useRef(0);
  const generationFinishedRef = useRef(false);

  const returnToListeningIfIdle = useCallback(() => {
    if (generationFinishedRef.current && queuedUtterancesRef.current === 0) {
      transitionToListening();
    }
  }, [transitionToListening]);

  const finishUtterance = useCallback(() => {
    queuedUtterancesRef.current = Math.max(0, queuedUtterancesRef.current - 1);
    returnToListeningIfIdle();
  }, [returnToListeningIfIdle]);

  const speakUtterance = useCallback(
    (text: string) => {
      const utterance = text.trim();
      if (!utterance) return;

      if (queuedUtterancesRef.current === 0) transitionToSpeaking();
      queuedUtterancesRef.current += 1;

      Speech.speak(utterance.slice(0, MAX_UTTERANCE_CHARS), {
        language,
        rate,
        pitch,
        onStart: transitionToSpeaking,
        onDone: finishUtterance,
        onStopped: finishUtterance,
        onError: finishUtterance,
      });
    },
    [language, rate, pitch, transitionToSpeaking, finishUtterance],
  );

  const flushPendingText = useCallback(() => {
    const result = pushSpeechText('', pendingTextRef.current, { forceCompletion: true });
    pendingTextRef.current = result.pending;
    result.utterances.forEach(speakUtterance);
  }, [speakUtterance]);

  const handleChunk = useCallback(
    (deltaText: string) => {
      if (!deltaText) return;
      const result = pushSpeechText(deltaText, pendingTextRef.current);
      pendingTextRef.current = result.pending;
      result.utterances.forEach(speakUtterance);
    },
    [speakUtterance],
  );

  const handleCompletion = useCallback(() => {
    generationFinishedRef.current = true;
    flushPendingText();
    returnToListeningIfIdle();
  }, [flushPendingText, returnToListeningIfIdle]);

  useEffect(() => {
    if (!enabled) return;

    const unsubscribeChunk = voiceStreamBridge.onChunk(handleChunk);
    const unsubscribeCompletion = voiceStreamBridge.onCompletion(handleCompletion);

    return () => {
      unsubscribeChunk();
      unsubscribeCompletion();
      void Speech.stop();
      pendingTextRef.current = '';
      queuedUtterancesRef.current = 0;
      generationFinishedRef.current = false;
    };
  }, [enabled, handleChunk, handleCompletion]);
}