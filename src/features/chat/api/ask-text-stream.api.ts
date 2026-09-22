import { envConfig } from '@/config';
import { fetch } from 'expo/fetch';

export type AskStreamEvent =
  | { type: 'metadata'; data: { thread_id: string; query: string } }
  | { type: 'start' }
  | { type: 'chunk'; content: string }
  | { type: 'complete'; data: unknown }
  | { type: 'error'; error: unknown };

/**
 * Streams a question to the backend `/v3/ask` endpoint and yields the parsed
 * SSE events one at a time:
 *
 *   for await (const event of createAskStream('hello', 'chat-1')) {
 *     if (event.type === 'chunk') ...
 *     if (event.type === 'complete') ...
 *   }
 */
export async function* createAskStream(
  query: string,
  threadId?: string | null
): AsyncGenerator<AskStreamEvent, void, unknown> {
  const url = envConfig.aiApiBaseUrl + '/v3/ask';

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'text/event-stream',
    },
    body: JSON.stringify({
      text: query,
      thread_id: threadId ?? null,
    }),
  });

  if (!response.body) {
    throw new Error('No response body from /v3/ask');
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();

  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();

    if (done) break;

    buffer += decoder.decode(value, { stream: true });

    const lines = buffer.split('\n');
    buffer = lines.pop() || '';

    for (const line of lines) {
      if (!line.startsWith('data: ')) continue;

      const jsonString = line.replace('data: ', '');

      if (jsonString === '[DONE]') return;

      try {
        const parsed = JSON.parse(jsonString);

        switch (parsed.event) {
          case 'metadata':
            yield { type: 'metadata', data: parsed.data };
            break;

          case 'start':
            yield { type: 'start' };
            break;

          case 'chunk':
            yield { type: 'chunk', content: parsed.data.content };
            break;

          case 'complete':
            yield { type: 'complete', data: parsed.data };
            break;
        }
      } catch (error) {
        yield { type: 'error', error };
      }
    }
  }
}