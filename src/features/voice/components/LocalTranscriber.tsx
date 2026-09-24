import { useLocalParticipant, useVoiceAssistant } from "@livekit/react-native";
import { ExpoSpeechRecognitionModule, useSpeechRecognitionEvent, type ExpoSpeechRecognitionErrorCode } from "expo-speech-recognition";
import { useCallback, useEffect, useRef } from "react";

export const USER_TRANSCRIPT_TOPIC = "user_transcript";
const LISTEN_STATES = new Set(["idle", "listening", "speaking"]);
const TRANSIENT_ERRORS: ExpoSpeechRecognitionErrorCode[] = ["busy", "network", "client", "unknown"];

export type UserTranscriptMessage = {
  type: "transcript";
  turnId: number;
  lang: string;
  text: string;
  isFinal: boolean;
};

type Props = {
  lang?: string;
  onTranscriptChange?: (text: string, isFinal: boolean) => void;
  onListeningChange?: (listening: boolean) => void;
  onError?: (code: ExpoSpeechRecognitionErrorCode) => void;
};


export default function LocalTranscriber({ lang = "hi-IN", onTranscriptChange, onListeningChange, onError }: Props) {
  const { localParticipant } = useLocalParticipant();
  const { state: agentState } = useVoiceAssistant();

  const activeRef = useRef(false); // Is a recognition session currently running
  const shouldListenRef = useRef(false); // Should the mic be listening right now (mirror of agentState ∈ {idle, listening})
  const restartTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null); // Handle for a scheduled re-start (setTimeout)
  const turnIdRef = useRef(0); // Incrementing turn counter
  const finalPublishedRef = useRef(false); // Already published a final for this utterance?
  const utteranceRef = useRef(""); // Latest transcript text of the current utterance

  const emitListening = useCallback((listening: boolean) => {
    if (!listening) onListeningChange?.(false);
    else onListeningChange?.(true);
  }, [onListeningChange]);

  const publish = useCallback(
    (text: string, isFinal: boolean) => {
      if (!localParticipant || !text) return;
      const message: UserTranscriptMessage = {
        type: "transcript",
        turnId: turnIdRef.current,
        lang,
        text,
        isFinal,
      };
      try {
        void localParticipant.publishData(
          new TextEncoder().encode(JSON.stringify(message)),
          { topic: USER_TRANSCRIPT_TOPIC, reliable: isFinal }
        );
      } catch {
        onError?.("client");
        return;
      }
      if (isFinal) {
        finalPublishedRef.current = true;
        turnIdRef.current += 1;
      }
      onTranscriptChange?.(text, isFinal);
  }, [localParticipant, lang, onTranscriptChange, onError]);

  const startSession = useCallback((delay = 0) => {
      if (activeRef.current) return;
      if (restartTimerRef.current) {
        clearTimeout(restartTimerRef.current);
        restartTimerRef.current = null;
      }
      const run = async () => {
        if (activeRef.current) return;
        const permission = await ExpoSpeechRecognitionModule.requestPermissionsAsync();
        if (!permission.granted) {
          onError?.("not-allowed");
          return;
        }
        activeRef.current = true;
        finalPublishedRef.current = false;
        utteranceRef.current = "";
        emitListening(true);
        ExpoSpeechRecognitionModule.start({
          lang,
          interimResults: true,
          maxAlternatives: 1,
          continuous: false,
          addsPunctuation: true,
          requiresOnDeviceRecognition: false,
          // iosCategory: {
          //   category: "playAndRecord",
          //   categoryOptions: ["defaultToSpeaker", "allowBluetooth"],
          //   mode: "measurement",
          // },
        });
      };
      if (delay > 0) {
        restartTimerRef.current = setTimeout(run, delay);
      } else {
        void run();
      }
    },
    [lang, onError, emitListening]
  );

  const stopSession = useCallback((discard = false) => {
      if (restartTimerRef.current) {
        clearTimeout(restartTimerRef.current);
        restartTimerRef.current = null;
      }
      if (!activeRef.current) return;
      activeRef.current = false;
      emitListening(false);
      if (discard) {
        ExpoSpeechRecognitionModule.abort();
      } else {
        ExpoSpeechRecognitionModule.stop();
      }
    },
    [emitListening]
  );

  const shouldListen = LISTEN_STATES.has(agentState);

  useEffect(() => {
    shouldListenRef.current = shouldListen;
    if (shouldListen) {
      if (!activeRef.current) startSession();
      else emitListening(true);
    } else {
      stopSession();
    }
  }, [shouldListen, agentState, startSession, stopSession, emitListening]);

  useSpeechRecognitionEvent("result", (event) => {
    const text = event.results.map((r) => r.transcript).join(" ").trim();

    console.log("SpeechRecognition result:", text, event.isFinal);
    if (!text) return;
    utteranceRef.current = text;
    publish(text, event.isFinal);
  });

  useSpeechRecognitionEvent("end", () => {
    activeRef.current = false;
    emitListening(false);
    const pending = utteranceRef.current.trim();
    if (pending && !finalPublishedRef.current) {
      publish(pending, true);
    }
    utteranceRef.current = "";
    finalPublishedRef.current = false;
    if (shouldListenRef.current) startSession(800);
  });

  useSpeechRecognitionEvent("error", (event) => {
    if ( event.error === "aborted" || event.error === "no-speech" || event.error === "speech-timeout") {
      return;
    }
    activeRef.current = false;
    emitListening(false);
    if (TRANSIENT_ERRORS.includes(event.error)) {
      if (shouldListenRef.current) startSession(1500);
    } else {
      onError?.(event.error);
    }
  });

  useEffect(() => {
    return () => {
      if (restartTimerRef.current) clearTimeout(restartTimerRef.current);
      ExpoSpeechRecognitionModule.abort();
    };
  }, []);

  return null;
}