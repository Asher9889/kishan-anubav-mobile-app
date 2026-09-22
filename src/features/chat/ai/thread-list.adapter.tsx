import { useMemo } from 'react';
import {
  RuntimeAdapterProvider,
  useAui,
  type RemoteThreadListAdapter,
  type RemoteThreadListProviderComponent,
  type RuntimeAdapters,
} from '@assistant-ui/react-native';
import { createAssistantStream } from 'assistant-stream';
import {
  deleteChatWithMessages,
  ensureChat,
  getChatById,
  getChats,
  setChatArchived,
  updateChatTitle,
} from '../services/chat.service';
import { buildThreadHistoryAdapter, firstUserText } from './persist';

const IDENTITY_TITLE_FALLBACK = 'New Chat';

/**
 * Wraps every mounted thread with the SQLite-backed history adapter so the
 * runtime sits on top of the same local database the rest of the app uses.
 */
const ChatHistoryProvider: RemoteThreadListProviderComponent = ({ children }) => {
  const aui = useAui();

  const history = useMemo(
    () => buildThreadHistoryAdapter({ threadListItem: aui.threadListItem }),
    [aui]
  );

  const adapters = useMemo<RuntimeAdapters>(() => ({ history }), [history]);

  return <RuntimeAdapterProvider adapters={adapters}>{children}</RuntimeAdapterProvider>;
};

/**
 * SQLite-backed thread list. Uses an identity mapping (`initialize` turns the
 * local thread id into the same remote id), so `chat.id` is both the
 * assistant-ui thread id and the `thread_id` sent to `/v3/ask`.
 */
export const threadListAdapter: RemoteThreadListAdapter = {
  async list() {
    const rows = await getChats();

    return {
      threads: rows
        .filter((row) => !row.archived)
        .map((row) => ({
          remoteId: row.id,
          status: 'regular' as const,
          title: row.title,
          lastMessageAt: new Date(row.lastMessageAt),
        })),
    };
  },

  async initialize(threadId) {
    await ensureChat({ id: threadId });

    return { remoteId: threadId };
  },

  async rename(remoteId, newTitle) {
    await updateChatTitle({ chatId: remoteId, title: newTitle });
  },

  async archive(remoteId) {
    await setChatArchived(remoteId, true);
  },

  async unarchive(remoteId) {
    await setChatArchived(remoteId, false);
  },

  async delete(remoteId) {
    await deleteChatWithMessages(remoteId);
  },

  async fetch(threadId) {
    const row = await getChatById(threadId);

    if (!row) {
      throw new Error(`Thread "${threadId}" not found.`);
    }

    return {
      remoteId: row.id,
      status: row.archived ? 'archived' as const : 'regular' as const,
      title: row.title,
      lastMessageAt: new Date(row.lastMessageAt),
    };
  },

  /**
   * Titles conversations by their first user message, matching the app's
   * existing behaviour. Persists the title and streams it back so the sidebar
   * label updates immediately.
   */
  async generateTitle(remoteId, messages) {
    const title = firstUserText(messages) || IDENTITY_TITLE_FALLBACK;

    await updateChatTitle({ chatId: remoteId, title });

    return createAssistantStream(async (controller) => {
      controller.appendText(title);
    });
  },

  unstable_Provider: ChatHistoryProvider,
};