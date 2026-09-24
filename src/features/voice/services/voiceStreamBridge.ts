/**
 * Tiny pub/sub that carries the LLM stream from the chat adapter into the
 * voice layer (TTS) without coupling the two modules.
 *
 * The chat adapter publishes the incremental text deltas of every response
 * it streams. `useVoiceTts` subscribes while a voice session is live; when no
 * one is subscribed the events are simply dropped (text-only chat stays
 * unaffected).
 */
export type VoiceChunkListener = (deltaText: string) => void;
export type VoiceCompletionListener = () => void;

class VoiceStreamBridge {
  private chunkListeners = new Set<VoiceChunkListener>();
  private completionListeners = new Set<VoiceCompletionListener>();

  /** Subscribe to streamed text deltas. Returns an unsubscribe function. */
  onChunk(listener: VoiceChunkListener): () => void {
    this.chunkListeners.add(listener);
    return () => {
      this.chunkListeners.delete(listener);
    };
  }

  /** Subscribe to the end of a generation. Returns an unsubscribe function. */
  onCompletion(listener: VoiceCompletionListener): () => void {
    this.completionListeners.add(listener);
    return () => {
      this.completionListeners.delete(listener);
    };
  }

  /** Called by the chat adapter for every incremental text delta. */
  publishChunk(deltaText: string): void {
    this.chunkListeners.forEach((listener) => listener(deltaText));
  }

  /** Called by the chat adapter when generation finishes (or errors). */
  publishCompletion(): void {
    this.completionListeners.forEach((listener) => listener());
  }
}

export const voiceStreamBridge = new VoiceStreamBridge();