import {
  ExportedMessageRepository,
  type ThreadHistoryAdapter,
  type ThreadMessage,
  type ThreadMessageLike,
  useAui,
} from '@assistant-ui/react-native';
import chats from '@/shared/db/models/chats.model';
import { messages } from '@/shared/db/models/messages.model';
import db from '@/shared/db/sqlite';
import { eq } from 'drizzle-orm';
import { ensureChat, getMessagesByChatId } from '../services/chat.service';

type DbMessageRow = typeof messages.$inferSelect;

export type DbMessage = DbMessageRow;

const textOf = (message: ThreadMessage): string =>
  message.content
    .filter((part): part is { type: 'text'; text: string } => part.type === 'text')
    .map((part) => part.text)
    .join('\n')
    .trim();

const messageCreatedAt = (message: ThreadMessage): number =>
  typeof message.createdAt === 'number'
    ? message.createdAt
    : message.createdAt instanceof Date
      ? message.createdAt.getTime()
      : Date.now();

/**
 * First user text in a thread. Used to derive chat titles.
 */
export function firstUserText(messagesOfThread: readonly ThreadMessage[] | readonly ThreadMessageLike[]): string {
  for (let i = messagesOfThread.length - 1; i >= 0; i--) {
    const message = messagesOfThread[i];
    if (message.role !== 'user') continue;

    const content = message.content;
    const text =
      typeof content === 'string'
        ? content.trim()
        : content
            .map((part) => (part.type === 'text' ? part.text : ''))
            .join(' ')
            .trim();

    if (text) return text;
  }

  return '';
}

function dbRowToMessageLike(row: DbMessageRow): ThreadMessageLike {
  return {
    id: row.id,
    role: row.role === 'user' ? 'user' : 'assistant',
    content: row.content ? [{ type: 'text', text: row.content }] : [],
    createdAt: new Date(row.createdAt),
    status: { type: 'complete', reason: 'stop' },
  };
}

/**
 * Loads a chat's messages from SQLite as an assistant-ui message repository
 * (list of DB messages in chronological order, chained as one linear thread).
 */
export async function loadThreadHistory(chatId: string): Promise<ExportedMessageRepository> {
  const rows = await getMessagesByChatId(chatId);

  if (rows.length === 0) return { messages: [] };

  const items = rows.map((row, index) => ({
    message: dbRowToMessageLike(row),
    parentId: index === 0 ? null : rows[index - 1].id,
  }));

  return ExportedMessageRepository.fromBranchableArray(items, {
    headId: rows[rows.length - 1].id,
  });
}

/**
 * Persists a single message appended by the assistant-ui runtime. Upserts so
 * messages that are re-appended (e.g. finalised assistant replies) don't
 * create duplicates.
 */
export async function saveThreadMessage(chatId: string, item: { parentId: string | null; message: ThreadMessage }) {
  const { message } = item;
  const createdAt = messageCreatedAt(message);
  const content = textOf(message);

  await db
    .insert(messages)
    .values({
      id: message.id,
      chatId,
      role: message.role === 'user' ? 'user' : 'ai',
      messageType: 'text',
      status: 'completed',
      content: content || null,
      translatedContent: null,
      createdAt,
      metadata: null,
    })
    .onConflictDoUpdate({
      target: messages.id,
      set: {
        content: content || null,
        status: 'completed',
      },
    });

  await db
    .update(chats)
    .set({
      updatedAt: createdAt,
      lastMessageAt: createdAt,
    })
    .where(eq(chats.id, chatId));
}

/**
 * Makes sure the chat row exists for a remote id (identity mapping:
 * remoteId === localId). Used by the thread list adapter lifecycle.
 */
export async function ensureChatRecord(remoteId: string) {
  await ensureChat({ id: remoteId });
}

/**
 * Builds the per-thread history adapter that reads/writes SQLite. Resolves the
 * thread's remote id lazily on every call (identity mapping), initialising the
 * chat row when it does not exist yet.
 */
export function buildThreadHistoryAdapter(aui: {
  threadListItem: ReturnType<typeof useAui>['threadListItem'];
}): ThreadHistoryAdapter {
  const getRemoteId = async () => {
    const { remoteId } = aui.threadListItem.getState();
    if (remoteId) return remoteId;

    const { remoteId: initialized } = await aui.threadListItem.initialize();
    return initialized;
  };

  return {
    async load() {
      const remoteId = aui.threadListItem.getState().remoteId;
      if (!remoteId) return { messages: [] };
      return loadThreadHistory(remoteId);
    },

    async append(item) {
      const remoteId = await getRemoteId();
      await saveThreadMessage(remoteId, item);
    },
  };
}