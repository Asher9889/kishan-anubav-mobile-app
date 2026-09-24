import { ExpoSpeechRecognitionModule, getSpeechRecognitionServices, isRecognitionAvailable, supportsOnDeviceRecognition, useSpeechRecognitionEvent, type ExpoSpeechRecognitionErrorCode } from "expo-speech-recognition";
import { useCallback, useEffect, useRef } from "react";
import { useVoiceSessionStore } from "../store/voiceSession.store";

const RESTART_DELAY_MS = 400;
const TRANSIENT_ERRORS: ExpoSpeechRecognitionErrorCode[] = ["busy", "network", "client", "unknown"];

/**
 * Errors that mean "on-device recognition is not available for this language
 * on this device" (a per-language model was not downloaded). Whenever one of
 * these arrives while on-device mode is on, we flip to network recognition
 * exactly once instead of dying silently.
 */
const ON_DEVICE_UNAVAILABLE: ExpoSpeechRecognitionErrorCode[] = [
  "language-not-supported",
  "service-not-allowed",
  "not-allowed",
  "audio-capture",
];

export type LocalTranscriberProps = {
  /** Requested speech language, e.g. "hi-IN". */
  lang?: string;
  /** Fired once per recognised utterance with its final text. */
  onUserUtterance?: (finalText: string) => void;
  onListeningChange?: (listening: boolean) => void;
  onError?: (code: ExpoSpeechRecognitionErrorCode) => void;
};

/**
 * On-device speech recognition for the turn-based voice chat.
 *
 * Instead of agent state, the recognizer watches the voice turn phase from
 * the store: it only listens while `phase === "listening"`, and it
 * auto-restarts after every pause so the mic feels continuously open.
 *
 * Recognised words are written to `liveTranscript` (which the composer
 * reflects in real time); the final text of an utterance is handed to
 * `onUserUtterance`, which the screen funnels into the normal chat thread.
 *
 * On-device recognition is preferred, but if the language model for the
 * requested locale is not installed the recognizer falls back to network
 * recognition once. Fatal errors are forwarded to `onError` so the UI can
 * show them instead of failing silently.
 */
export default function LocalTranscriber({ lang = "hi-IN", onUserUtterance, onListeningChange, onError }: LocalTranscriberProps) {
  const phase = useVoiceSessionStore((state) => state.phase);
  const setLiveTranscript = useVoiceSessionStore((state) => state.setLiveTranscript);
  const resetTranscript = useVoiceSessionStore((state) => state.resetTranscript);

  const activeRef = useRef(false); // Is a recognition session currently running
  const shouldListenRef = useRef(false); // Mirror of `phase === "listening"`
  const restartTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null); // Handle for a scheduled re-start (setTimeout)
  const finalDeliveredRef = useRef(false); // Already delivered the final text for this utterance
  const utteranceRef = useRef(""); // Latest transcript text of the current utterance
  const useOnDeviceRef = useRef(true); // Prefer on-device; flips to network once if unavailable
  const permissionsGrantedRef = useRef(false); // Avoid re-prompting after the first grant

  const startSession = useCallback((delay = 0) => {
      if (activeRef.current) return;
      if (restartTimerRef.current) {
        clearTimeout(restartTimerRef.current);
        restartTimerRef.current = null;
      }
      const run = async () => {
        if (activeRef.current) return;
        if (!ExpoSpeechRecognitionModule?.start) {
          console.log("[LocalTranscriber] native module missing — rebuild the dev client");
          onError?.("service-not-allowed");
          return;
        }
        if (!permissionsGrantedRef.current) {
          const permission = await ExpoSpeechRecognitionModule.requestPermissionsAsync();
          permissionsGrantedRef.current = true;
          if (!permission.granted) {
            onError?.("not-allowed");
            return;
          }
        }
        activeRef.current = true;
        finalDeliveredRef.current = false;
        utteranceRef.current = "";
        onListeningChange?.(true);
        console.log(`[LocalTranscriber] start (onDevice=${useOnDeviceRef.current}, lang=${lang})`);
        ExpoSpeechRecognitionModule.start({
          lang,
          interimResults: true,
          maxAlternatives: 1,
          continuous: false,
          addsPunctuation: true,
          requiresOnDeviceRecognition: useOnDeviceRef.current,
        });
      };
      if (delay > 0) {
        restartTimerRef.current = setTimeout(run, delay);
      } else {
        void run();
      }
    },
    [lang, onError, onListeningChange]
  );

  const stopSession = useCallback((discard = false) => {
      if (restartTimerRef.current) {
        clearTimeout(restartTimerRef.current);
        restartTimerRef.current = null;
      }
      if (!activeRef.current) return;
      activeRef.current = false;
      onListeningChange?.(false);
      if (discard) {
        ExpoSpeechRecognitionModule.abort();
      } else {
        ExpoSpeechRecognitionModule.stop();
      }
    },
    [onListeningChange]
  );

  const deliverFinalUtterance = useCallback((text: string) => {
      const trimmed = text.trim();
      if (!trimmed) return;
      if (finalDeliveredRef.current) return;
      finalDeliveredRef.current = true;
      onUserUtterance?.(trimmed);
    },
    [onUserUtterance]
  );

  const shouldListen = phase === "listening";

  useEffect(() => {
    shouldListenRef.current = shouldListen;
    if (shouldListen) {
      if (!activeRef.current) startSession();
      else onListeningChange?.(true);
    } else {
      stopSession();
    }
  }, [shouldListen, startSession, stopSession, onListeningChange]);

  useSpeechRecognitionEvent("result", (event) => {
    const text = event.results.map((r) => r.transcript).join(" ").trim();

    console.log("[LocalTranscriber] result:", text, "final:", event.isFinal);
    if (!text) return;
    utteranceRef.current = text;
    setLiveTranscript(text);

    if (event.isFinal) {
      resetTranscript();
      deliverFinalUtterance(text);
    }
  });

  useSpeechRecognitionEvent("end", () => {
    activeRef.current = false;
    onListeningChange?.(false);
    deliverFinalUtterance(utteranceRef.current);
    resetTranscript();
    if (shouldListenRef.current) startSession(RESTART_DELAY_MS);
  });

  useSpeechRecognitionEvent("error", (event) => {
    if (event.error === "aborted" || event.error === "no-speech" || event.error === "speech-timeout") {
      return;
    }
    console.log("[LocalTranscriber] error:", event.error, event.message);

    // On-device requested but not available for this language → drop to
    // network recognition once, then keep going.
    if (useOnDeviceRef.current && ON_DEVICE_UNAVAILABLE.includes(event.error)) {
      useOnDeviceRef.current = false;
      console.log("[LocalTranscriber] on-device unavailable, falling back to network");
      activeRef.current = false;
      if (shouldListenRef.current) startSession(RESTART_DELAY_MS * 2);
      return;
    }

    activeRef.current = false;
    onListeningChange?.(false);
    if (TRANSIENT_ERRORS.includes(event.error)) {
      if (shouldListenRef.current) startSession(RESTART_DELAY_MS * 3);
    } else {
      onError?.(event.error);
    }
  });

  useEffect(() => {
    // Early diagnostics so recognizer availability is visible in the logs the
    // moment the chat screen mounts.
    console.log("[LocalTranscriber] recognitionAvailable:", isRecognitionAvailable());
    console.log("[LocalTranscriber] speech services:", getSpeechRecognitionServices());
    console.log("[LocalTranscriber] onDeviceSupported:", supportsOnDeviceRecognition());
  }, []);

  useEffect(() => {
    return () => {
      if (restartTimerRef.current) clearTimeout(restartTimerRef.current);
      ExpoSpeechRecognitionModule.abort();
    };
  }, []);

  return null;
}