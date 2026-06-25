import { askQuestionStream } from '../api/ask-text-stream.api';
import { StreamHandlers } from '../types/types';
import { createChat } from './chat.service';

type SendTextMessageParams = {
  query: string;
  chatId: string | null;
  handlers: StreamHandlers;
};

export async function sendTextMessage({ query, chatId, handlers }: SendTextMessageParams) {
  let currentChatId = chatId;

  if(!currentChatId) {
    currentChatId = await createChat({title: query});
  }

  let fullAnswer = '';

  await askQuestionStream(query, currentChatId,
    {
      onMetadata(data) {
        handlers.onMetadata?.(data);
      },
      onStart() {
        handlers.onStart?.();
      },
      onChunk(chunk) {
        fullAnswer += chunk;
        handlers.onChunk?.(chunk);
      },
      async onComplete(data) {
        handlers.onComplete?.(data);
      },
      onError(error) {
        handlers.onError?.(error);
      },
    }
  );

  return currentChatId;
}