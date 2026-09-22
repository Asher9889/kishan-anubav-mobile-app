import type { ChatModelAdapter, ThreadMessage } from '@assistant-ui/react-native';
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

    try {
      for await (const event of createAskStream(query, unstable_threadId ?? null)) {
        switch (event.type) {
          case 'chunk':
            fullAnswer += event.content;
            yield { content: [{ type: 'text', text: fullAnswer }] };
            break;

          case 'complete':
            yield {
              content: [{ type: 'text', text: fullAnswer }],
              status: { type: 'complete', reason: 'stop' },
            };
            return;

          case 'error':
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

      yield {
        content: [{ type: 'text', text: fullAnswer }],
        status: { type: 'complete', reason: 'stop' },
      };
    } catch (error) {
      yield {
        content: [{ type: 'text', text: fullAnswer }],
        status: { type: 'incomplete', reason: 'error', error: toJsonError(error) },
      };
    }
  },
};