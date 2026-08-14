import { useLocalParticipant } from "@livekit/react-native";
import type { LocalAudioTrack } from "livekit-client";
import { useEffect, useRef } from "react";
import {
  startLocalMicDump,
  type LocalMicDump as LocalMicDumpHandle,
  type LocalMicDumpResult,
} from "../debug/localMicDump";

type Props = {
  enabled: boolean;
  sampleRate?: number;
  onStateChange?: (recording: boolean) => void;
  onSaved?: (result: LocalMicDumpResult) => void;
  onError?: (message: string) => void;
};

const LocalMicDump = ({ enabled, sampleRate, onStateChange, onSaved, onError }: Props) => {
  const { microphoneTrack } = useLocalParticipant();
  const track = microphoneTrack?.track;

  const onStateChangeRef = useRef(onStateChange);
  const onSavedRef = useRef(onSaved);
  const onErrorRef = useRef(onError);

  useEffect(() => {
    onStateChangeRef.current = onStateChange;
    onSavedRef.current = onSaved;
    onErrorRef.current = onError;
  }, [onStateChange, onSaved, onError]);

  useEffect(() => {
    if (!enabled || !track) return;

    let dump: LocalMicDumpHandle | null = null;
    try {
      dump = startLocalMicDump(track as LocalAudioTrack, { sampleRate });
      onStateChangeRef.current?.(true);
    } catch (error) {
      onErrorRef.current?.(error instanceof Error ? error.message : String(error));
      return;
    }

    return () => {
      onStateChangeRef.current?.(false);
      const handle = dump;
      void handle
        ?.stop()
        .then((result) => onSavedRef.current?.(result))
        .catch((error) =>
          onErrorRef.current?.(error instanceof Error ? error.message : String(error))
        );
    };
  }, [enabled, track, sampleRate]);

  return null;
};

export default LocalMicDump;
