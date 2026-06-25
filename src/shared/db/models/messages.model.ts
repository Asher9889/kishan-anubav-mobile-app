import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import chats from "./chats.model";

export const messages = sqliteTable("messages", {
      id: text("id").primaryKey(),

      chatId: text("chat_id").references(() => chats.id).notNull(),

      role: text("role").$type<"user"| "ai">().notNull(),

      messageType: text("message_type").$type<"text" | "voice" | "image" | "weather">().notNull(),

      status: text("status").$type<"completed" | "failed"| "pending">().default("completed"),

      content:text("content"),

      translatedContent: text("translated_content"),

      createdAt: integer("created_at").notNull(),

      metadata: text("metadata"),
    }
);

export default messages;