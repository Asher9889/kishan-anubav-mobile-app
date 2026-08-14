import { useColor } from "@/hooks/useColor";
import { Paths } from "expo-file-system";
import { useAudioPlayer, useAudioPlayerStatus } from "expo-audio";
import * as Sharing from "expo-sharing";
import { Pause, Play, Share } from "lucide-react-native";
import { useEffect, useMemo } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type { LocalMicDumpResult } from "../debug/localMicDump";

export type ProcessingFlags = {
  echoCancellation: boolean;
  noiseSuppression: boolean;
  autoGainControl: boolean;
  voiceIsolation: boolean;
};

type Props = {
  flags: ProcessingFlags;
  onFlagsChange: (flags: ProcessingFlags) => void;
  recording: boolean;
  onToggleRecord: () => void;
  lastSaved?: LocalMicDumpResult | null;
};

const CHIPS: { key: keyof ProcessingFlags; label: string; hint: string }[] = [
  { key: "echoCancellation", label: "EC", hint: "echoCancellation" },
  { key: "noiseSuppression", label: "NS", hint: "noiseSuppression" },
  { key: "autoGainControl", label: "AGC", hint: "autoGainControl" },
  { key: "voiceIsolation", label: "VI", hint: "voiceIsolation" },
];

function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${String(secs).padStart(2, "0")}`;
}

const AudioDebugBar = ({ flags, onFlagsChange, recording, onToggleRecord, lastSaved }: Props) => {
  const insets = useSafeAreaInsets();
  const surface = useColor("inverseSurface");
  const onSurface = useColor("inverseOnSurface");
  const muted = useColor("textMuted");
  const accent = useColor("primaryContainer");
  const onAccent = useColor("onPrimaryContainer");
  const record = useColor("red");

  const player = useAudioPlayer(null);
  const status = useAudioPlayerStatus(player);
  const lastUri = lastSaved?.uri;

  useEffect(() => {
    if (lastUri) player.replace({ uri: lastUri });
  }, [lastUri, player]);

  const handleTogglePlay = () => {
    if (status.playing) {
      player.pause();
    } else {
      if (status.isLoaded || lastUri) player.play();
    }
  };

  const handleShare = async () => {
    if (!lastUri) return;
    try {
      if (!(await Sharing.isAvailableAsync())) {
        console.warn("[MIC DUMP] sharing not available on this device");
        return;
      }
      await Sharing.shareAsync(lastUri, {
        mimeType: "audio/wav",
        dialogTitle: lastSaved?.fileName,
        UTI: "com.microsoft.waveform-audio",
      });
    } catch (error) {
      console.warn("[MIC DUMP] share failed:", error);
    }
  };

  const fileName = useMemo(() => lastSaved?.fileName ?? "", [lastSaved]);

  return (
    <View
      style={[
        styles.panel,
        { top: insets.top + 8, backgroundColor: surface },
      ]}
    >
      <View style={styles.headerRow}>
        <Text style={[styles.title, { color: onSurface }]}>MIC DUMP</Text>
        <View style={styles.statusRow}>
          <View
            style={[
              styles.dot,
              { backgroundColor: recording ? record : muted },
            ]}
          />
          <Text style={[styles.status, { color: recording ? record : muted }]}>
            {recording ? "REC" : lastSaved ? `SAVED ${(lastSaved.bytes / 1024).toFixed(0)}KB` : "IDLE"}
          </Text>
        </View>
      </View>

      <View style={styles.chipsRow}>
        {CHIPS.map((chip) => {
          const active = flags[chip.key];
          return (
            <Pressable
              key={chip.key}
              accessibilityLabel={chip.hint}
              onPress={() => onFlagsChange({ ...flags, [chip.key]: !active })}
              style={[
                styles.chip,
                active
                  ? { backgroundColor: accent }
                  : { backgroundColor: "transparent", borderColor: muted },
              ]}
            >
              <Text
                style={[
                  styles.chipLabel,
                  { color: active ? onAccent : muted },
                ]}
              >
                {chip.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <Pressable
        onPress={onToggleRecord}
        style={[
          styles.recordButton,
          { backgroundColor: recording ? record : accent },
        ]}
      >
        <Text style={[styles.recordLabel, { color: recording ? "#FFFFFF" : onAccent }]}>
          {recording ? "■ Stop & Save" : "● Record mic"}
        </Text>
      </Pressable>

      {lastSaved && (
        <>
          <View style={styles.playerRow}>
            <Pressable
              onPress={handleTogglePlay}
              accessibilityLabel={status.playing ? "Pause recording" : "Play recording"}
              style={[styles.playButton, { backgroundColor: accent }]}
            >
              {status.playing ? (
                <Pause size={16} color={onAccent} />
              ) : (
                <Play size={16} color={onAccent} style={{ marginLeft: 1 }} />
              )}
            </Pressable>
            <Text style={[styles.playerTime, { color: onSurface }]}>
              {formatTime(status.currentTime)} / {formatTime(status.duration)}
            </Text>
            <Pressable
              onPress={handleShare}
              accessibilityLabel="Share recording"
              style={[styles.shareButton, { backgroundColor: accent }]}
            >
              <Share size={14} color={onAccent} />
            </Pressable>
          </View>
          <Text style={[styles.fileName, { color: muted }]} numberOfLines={1}>
            {fileName} · {lastSaved.sampleRate}Hz
          </Text>
        </>
      )}
      <Text style={[styles.dirHint, { color: muted }]} numberOfLines={1}>
        {Paths.cache.uri}/audio-dumps
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  panel: {
    position: "absolute",
    left: 12,
    right: 12,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 8,
    shadowColor: "#000",
    shadowOpacity: 0.18,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1.2,
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  status: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  chipsRow: {
    flexDirection: "row",
    gap: 6,
  },
  chip: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    borderWidth: 1,
  },
  chipLabel: {
    fontSize: 11,
    fontWeight: "700",
  },
  recordButton: {
    borderRadius: 10,
    paddingVertical: 8,
    alignItems: "center",
  },
  recordLabel: {
    fontSize: 13,
    fontWeight: "800",
  },
  playerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  playButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  playerTime: {
    flex: 1,
    fontSize: 12,
    fontWeight: "700",
    fontVariant: ["tabular-nums"],
  },
  shareButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  fileName: {
    fontSize: 11,
  },
  dirHint: {
    fontSize: 10,
    opacity: 0.75,
  },
});

export default AudioDebugBar;
