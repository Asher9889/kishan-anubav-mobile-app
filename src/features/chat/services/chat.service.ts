import attachments from '@/shared/db/models/attachments.model';
import chats from '@/shared/db/models/chats.model';
import messages from '@/shared/db/models/messages.model';
import db from '@/shared/db/sqlite';
import * as crypto from "expo-crypto";

import { api, endPoints } from '@/shared/api';
import { asc, desc, eq, inArray } from 'drizzle-orm';

export async function askQuestion(query: string, chatId?: string | null) {
  const { method, url } = endPoints.AI.ASK;

  const data: any = { text: query };
  if (chatId) {
    data.thread_id = chatId;
  }

  const response = await api.request({url, method, data});

  return response;
}

type SaveConversationParams = {
  chatId: string;
  query: string;
  answer: string;
  audioUri?: string;
};

export async function saveConversation({chatId, query, answer, audioUri}: SaveConversationParams) {

  const now = Date.now();
  const userMessageId = crypto.randomUUID();
  const aiMessageId = crypto.randomUUID();

  /**
   * USER MESSAGE
   */
  await db.insert(messages).values({
    id: userMessageId,
    chatId,
    role: 'user',
    messageType: 'text',
    status: 'completed',
    content: query,
    translatedContent: null,
    createdAt: now,
    metadata: null,
  });

  /**
   * AUDIO ATTACHMENT
   */
  if (audioUri) {
    await db.insert(attachments).values({
      id: crypto.randomUUID(),
      messageId: userMessageId,
      type: 'audio',
      localUri: audioUri,
      createdAt: now,
    });
  }

  /**
   * AI MESSAGE
   */
  await db.insert(messages).values({
    id: aiMessageId,
    chatId,
    role: 'ai',
    messageType: 'text',
    status: 'completed',
    content: answer,
    translatedContent: null,
    createdAt: now + 1,
    metadata: null,
  });

  /**
   * UPDATE CHAT
   */
  await db
    .update(chats)
    .set({
      updatedAt: now,
      lastMessageAt: now,
    })
    .where(eq(chats.id, chatId));

  return {
    userMessageId,
    aiMessageId,
  };
}

export async function saveUserMessage({ chatId, query, audioUri }: { chatId: string; query: string; audioUri?: string }) {
  const now = Date.now();
  const userMessageId = crypto.randomUUID();

  await db.insert(messages).values({
    id: userMessageId,
    chatId,
    role: 'user',
    messageType: 'text',
    status: 'completed',
    content: query,
    translatedContent: null,
    createdAt: now,
    metadata: null,
  });

  if (audioUri) {
    await db.insert(attachments).values({
      id: crypto.randomUUID(),
      messageId: userMessageId,
      type: 'audio',
      localUri: audioUri,
      createdAt: now,
    });
  }

  return userMessageId;
}

export async function saveAIMessage({ chatId, query }: { chatId: string; query: string }) {
  const now = Date.now();
  const aiMessageId = crypto.randomUUID();

  await db.insert(messages).values({
    id: aiMessageId,
    chatId,
    role: 'ai',
    messageType: 'text',
    status: 'completed',
    content: query,
    translatedContent: null,
    createdAt: now,
    metadata: null,
  });

  return aiMessageId;
}

export async function createChat({ title }: {title: string;}) {

  const chatId = crypto.randomUUID();
  const now = Date.now();

  await db.insert(chats).values({
    id: chatId,
    title: title.slice(0, 80),
    createdAt: now,
    updatedAt: now,
    lastMessageAt: now
  });

  return chatId;
}

export async function updateChatTitle({ chatId, title }: { chatId: string; title: string }) {

  return db.update(chats)
    .set({
      title: title.slice(0, 80),
      updatedAt: Date.now(),
    })
    .where(eq(chats.id, chatId));
}

export async function getMessagesByChatId(chatId: string) {

  return db.query.messages.findMany({
    where: eq(messages.chatId, chatId),
    orderBy: asc(messages.createdAt),
    // limit: 50,
  });
}

export async function getChats() {

  return db.query.chats.findMany({
    columns: {
        id: true,
        title: true,
        lastMessageAt: true,
        archived: true,
    },
    orderBy: desc( // desc meams decending order
      chats.lastMessageAt
    ),
  }); 

}

/**
 * Inserts a chat row for the given id (used by the assistant-ui thread
 * lifecycle when a new thread is initialized) and bumps its timestamps. Safe
 * to call repeatedly.
 */
export async function ensureChat({ id, title }: { id: string; title?: string }) {
  const now = Date.now();

  await db.insert(chats)
    .values({
      id,
      title: (title ?? 'New Chat').slice(0, 80),
      createdAt: now,
      updatedAt: now,
      lastMessageAt: now,
    })
    .onConflictDoUpdate({
      target: chats.id,
      set: {
        updatedAt: now,
        lastMessageAt: now,
      },
    });
}

export async function getChatById(chatId: string) {
  const result = await db.query.chats.findFirst({
    where: eq(chats.id, chatId),
  });

  return result ?? null;
}

export async function setChatArchived(chatId: string, archived: boolean) {
  return db
    .update(chats)
    .set({ archived })
    .where(eq(chats.id, chatId));
}

export async function deleteChatWithMessages(chatId: string) {
  const messageIds = await db
    .select({ id: messages.id })
    .from(messages)
    .where(eq(messages.chatId, chatId));

  const ids = messageIds.map((m) => m.id);

  if (ids.length > 0) {
    await db
      .delete(attachments)
      .where(inArray(attachments.messageId, ids));
  }

  await db
    .delete(messages)
    .where(eq(messages.chatId, chatId));

  await db
    .delete(chats)
    .where(eq(chats.id, chatId));
}