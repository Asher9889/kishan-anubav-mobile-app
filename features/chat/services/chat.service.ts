import attachments from '@/shared/db/models/attachments.model';
import chats from '@/shared/db/models/chats.model';
import messages from '@/shared/db/models/messages.model';
import db from '@/shared/db/sqlite';
import * as crypto from "expo-crypto";

import { asc, desc, eq } from 'drizzle-orm';
import { api, endPoints } from '@/shared/api';

export async function askQuestion(query: string, chatId?: string | null) {
  const { method, url } = endPoints.AI.ASK;

  const data: any = { query };
  if (chatId) {
    data.thread_id = chatId;
  }

  const response = await api.request<any, any>({
    url,
    method,
    data,
  });

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
    },
    orderBy: desc( // desc meabs decending order
      chats.lastMessageAt
    ),
  }); 

}