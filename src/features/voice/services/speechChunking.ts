/**
 * Buffers an LLM token stream and hands back whole sentences for TTS.
 *
 * LLM responses arrive as a continuous drip of tokens; speaking each token
 * sounds robotic. Instead we accumulate incoming text and only release
 * chunks that end with sentence punctuation (Hindi `।` included). Anything
 * still mid-sentence stays in the pending buffer for the next chunk.
 */
export const MAX_PENDING_CHARS = 240;

const TERMINAL_PUNCTUATION = /[.!?।]/;
const SENTENCE_PIECES = /[^.!?।]+[.!?।]?/g;

export type SpeechChunkResult = {
  /** Sentences that are safe to speak now. */
  utterances: string[];
  /** Text still building up for the next chunk. */
  pending: string;
};

/**
 * Feeds a new text delta into the buffer and returns the speakable
 * sentences plus whatever still needs more text.
 *
 * @param incoming          new delta from the LLM stream
 * @param pending           previously buffered (incomplete) text
 * @param forceCompletion   when true, every remaining character is released
 *                          as an utterance (used when generation ends)
 */
export function pushSpeechText(
  incoming: string,
  pending: string,
  options?: { forceCompletion?: boolean },
): SpeechChunkResult {
  const combined = (pending + incoming).replace(/\s+/g, ' ').trim();

  const pieces = combined.match(SENTENCE_PIECES) ?? [];

  const utterances = pieces
    .filter((piece) => TERMINAL_PUNCTUATION.test(piece))
    .map((piece) => piece.trim())
    .filter(Boolean);

  let remainder = pieces
    .filter((piece) => !TERMINAL_PUNCTUATION.test(piece))
    .join('')
    .trimStart();

  const forceCompletion = options?.forceCompletion ?? false;

  if (forceCompletion) {
    if (remainder) utterances.push(remainder.trim());
    remainder = '';
  } else if (remainder.length > MAX_PENDING_CHARS) {
    // Long unpunctuated stretches must not turn into one giant utterance;
    // cut them into capped chunks at the last word boundary.
    while (remainder.length > MAX_PENDING_CHARS) {
      const segment = remainder.slice(0, MAX_PENDING_CHARS);
      const lastSpace = segment.lastIndexOf(' ');
      const cutAt = lastSpace > 0 ? lastSpace : MAX_PENDING_CHARS;
      const head = remainder.slice(0, cutAt).trim();
      if (head) utterances.push(head);
      remainder = remainder.slice(cutAt).trimStart();
    }
  }

  return { utterances: utterances.filter(Boolean), pending: remainder };
}