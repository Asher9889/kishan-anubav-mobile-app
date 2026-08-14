import { MediaRecorder } from "@livekit/react-native";
import { MediaStream, type MediaStreamTrack } from "@livekit/react-native-webrtc";
import { Directory, File, Paths } from "expo-file-system";
import type { LocalAudioTrack } from "livekit-client";

export type LocalMicDumpOptions = {
  sampleRate?: number;
  label?: string;
};

export type LocalMicDumpResult = {
  uri: string;
  fileName: string;
  bytes: number;
  durationMs: number;
  sampleRate: number;
};

export type LocalMicDump = {
  stop: () => Promise<LocalMicDumpResult>;
};

const DEFAULT_SAMPLE_RATE = 48000;
const TRAILING_EVENT_GRACE_MS = 300;

async function resolveSampleRate(track: LocalAudioTrack, fallback: number): Promise<number> {
  try {
    const stats = await track.getRTCStatsReport();
    if (stats) {
      let matched: number | undefined;
      stats.forEach((report) => {
        if (matched === undefined && report.type === "outbound-rtp" && report.kind === "audio" && typeof report.sampleRate === "number") {
          matched = report.sampleRate;
        }
      });
      if (matched !== undefined) return matched;
    }
  } catch {
    // fall through to the configured rate
  }
  return fallback;
}

function pcm16WavHeader(sampleRate: number, dataLength: number): Uint8Array {
  const buffer = new ArrayBuffer(44);
  const view = new DataView(buffer);
  const writeString = (offset: number, str: string) => {
    for (let i = 0; i < str.length; i++) {
      view.setUint8(offset + i, str.charCodeAt(i));
    }
  };

  const channels = 1;
  const bitsPerSample = 16;
  const blockAlign = (channels * bitsPerSample) / 8;
  const byteRate = sampleRate * blockAlign;

  writeString(0, "RIFF");
  view.setUint32(4, 36 + dataLength, true);
  writeString(8, "WAVE");
  writeString(12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, channels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, byteRate, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, bitsPerSample, true);
  writeString(36, "data");
  view.setUint32(40, dataLength, true);

  return new Uint8Array(buffer);
}

function timestamp(): string {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}-${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}`;
}

export function startLocalMicDump(
  track: LocalAudioTrack,
  options: LocalMicDumpOptions = {}
): LocalMicDump {
  const sampleRate = options.sampleRate ?? DEFAULT_SAMPLE_RATE;
  const label = options.label ?? "livekit";
  const mediaStreamTrack = track.mediaStreamTrack as unknown as MediaStreamTrack;
  const stream = new MediaStream([mediaStreamTrack]);
  const recorder = new MediaRecorder(stream);

  const chunks: Uint8Array[] = [];
  const startedAt = Date.now();
  let stopped = false;
  let effectiveSampleRate = sampleRate;

  void resolveSampleRate(track, sampleRate).then((rate) => {
    if (!stopped) effectiveSampleRate = rate;
  });

  recorder.ondataavailable = (event) => {
    chunks.push((event as unknown as { data: { byteArray: Uint8Array } }).data.byteArray);
  };

  recorder.start();

  const stop = async (): Promise<LocalMicDumpResult> => {
    if (stopped) {
      throw new Error("LocalMicDump already stopped");
    }
    stopped = true;
    recorder.stop();

    await new Promise((resolve) => setTimeout(resolve, TRAILING_EVENT_GRACE_MS));

    const dataLength = chunks.reduce((total, chunk) => total + chunk.length, 0);
    const wav = new Uint8Array(44 + dataLength);
    wav.set(pcm16WavHeader(effectiveSampleRate, dataLength), 0);
    let offset = 44;
    for (const chunk of chunks) {
      wav.set(chunk, offset);
      offset += chunk.length;
    }

    const dir = new Directory(Paths.cache, "audio-dumps");
    dir.create({ intermediates: true, idempotent: true });

    const fileName = `mic-${label}-${timestamp()}.wav`;
    const file = new File(dir, fileName);
    file.create({ overwrite: true });
    file.write(wav);

    return {
      uri: file.uri,
      fileName,
      bytes: wav.length,
      durationMs: Date.now() - startedAt,
      sampleRate: effectiveSampleRate,
    };
  };

  return { stop };
}
