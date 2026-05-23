import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const attachments = sqliteTable("attachments", {
      id: text("id").primaryKey(),
      messageId: text("message_id").notNull(),
      type: text("type").$type<"audio" | "image"| "document">().notNull(),
      localUri: text("local_uri").notNull(),
      remoteUrl: text("remote_url"),
      mimeType: text("mime_type"),
      fileName: text("file_name"),
      fileSize: integer("file_size"),
      duration: integer("duration"),
      width: integer("width"),
      height: integer("height"),
      createdAt:integer("created_at").notNull(),
    }
);

export default attachments;