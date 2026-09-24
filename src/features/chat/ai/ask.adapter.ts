import type { ChatModelAdapter, ThreadMessage } from '@assistant-ui/react-native';
import { voiceStreamBridge } from '@/features/voice/services/voiceStreamBridge';
import { createAskStream } from '../api/ask-text-stream.api';

const textOfUserMessage = (message: ThreadMessage): string => {
  if (message.role !== 'user') return '';

  return message.content
    .filter((part): part is { type: 'text'; text: string } => part.type === 'text')
    .map((part) => part.text)
    .join('\n')
    .trim();
};

const lastUserText = (messages: readonly ThreadMessage[]): string => {
  for (let i = messages.length - 1; i >= 0; i--) {
    const text = textOfUserMessage(messages[i]);
    if (text) return text;
  }

  return '';
};

const toJsonError = (error: unknown): string => {
  if (typeof error === 'string') return error;
  if (error instanceof Error) return error.message;
  return JSON.stringify(error) ?? String(error);
};

/**
 * Streams each new chat message through the app's custom `/v3/ask` SSE
 * protocol. Yields the full accumulated text on every chunk so assistant-ui
 * re-renders the bubble progressively.
 */
export const askChatModelAdapter: ChatModelAdapter = {
  async *run({ messages, unstable_threadId }) {
    const query = lastUserText(messages);
    if (!query) return;

    let fullAnswer = '';
    let previouslyStreamedText = '';

    /**
     * Forward only the newly arrived slice of the answer to the voice layer
     * (thread text is untouched — assistant-ui still renders the full
     * accumulated text so UI and TTS stay in lock-step).
     */
    const publishDelta = () => {
      const delta = fullAnswer.slice(previouslyStreamedText.length);
      previouslyStreamedText = fullAnswer;
      if (delta) voiceStreamBridge.publishChunk(delta);
    };

    const publishCompletion = () => voiceStreamBridge.publishCompletion();

    try {
      for await (const event of createAskStream(query, unstable_threadId ?? null)) {
        switch (event.type) {
          case 'chunk':
            fullAnswer += event.content;
            publishDelta();
            yield { content: [{ type: 'text', text: fullAnswer }] };
            break;

          case 'complete':
            publishCompletion();
            yield {
              content: [{ type: 'text', text: fullAnswer }],
              status: { type: 'complete', reason: 'stop' },
            };
            return;

          case 'error':
            publishCompletion();
            yield {
              content: [{ type: 'text', text: fullAnswer }],
              status: {
                type: 'incomplete',
                reason: 'error',
                error: toJsonError(event.error),
              },
            };
            return;

          case 'metadata':
          case 'start':
            break;
        }
      }

      publishCompletion();
      yield {
        content: [{ type: 'text', text: fullAnswer }],
        status: { type: 'complete', reason: 'stop' },
      };
    } catch (error) {
      publishCompletion();
      yield {
        content: [{ type: 'text', text: fullAnswer }],
        status: { type: 'incomplete', reason: 'error', error: toJsonError(error) },
      };
    }
  },
};