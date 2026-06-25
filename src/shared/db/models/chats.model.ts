import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

const chats = sqliteTable("chats", {
    id: text("id").primaryKey(),
    title : text("title").notNull(),
    createdAt: integer("created_at").notNull(),
    updatedAt: integer("updated_at").notNull(),
    lastMessageAt: integer("last_message_at").notNull(),
    archived: integer("archived", { mode: "boolean" }).default(sql`0`),
});

export default chats;