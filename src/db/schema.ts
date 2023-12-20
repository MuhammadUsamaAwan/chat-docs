import { relations } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const chats = sqliteTable('chats', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text('name').notNull(),
  save: integer('save', { mode: 'boolean' }).notNull().default(true),
  k: integer('k').notNull().default(1),
  createdAt: integer('createdAt', { mode: 'timestamp' })
    .notNull()
    .$defaultFn(() => new Date()),
});

export const chatFiles = sqliteTable('chatFiles', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  chatId: text('chatId')
    .notNull()
    .references(() => chats.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  path: text('path').notNull(),
  createdAt: integer('createdAt', { mode: 'timestamp' })
    .notNull()
    .$defaultFn(() => new Date()),
});

export const chatMessages = sqliteTable('chatMessages', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  chatId: text('chatId')
    .notNull()
    .references(() => chats.id, { onDelete: 'cascade' }),
  role: text('role', { enum: ['user', 'system'] }).notNull(),
  content: text('content').notNull(),
  createdAt: integer('createdAt', { mode: 'timestamp' })
    .notNull()
    .$defaultFn(() => new Date()),
});

export const chatsRelations = relations(chats, ({ many }) => ({
  chatFiles: many(chatFiles),
  chatMessages: many(chatMessages),
}));

export const chatFilesRelations = relations(chatFiles, ({ one }) => ({
  chat: one(chats, {
    fields: [chatFiles.chatId],
    references: [chats.id],
  }),
}));

export const chatMessagesRelations = relations(chatMessages, ({ one }) => ({
  chat: one(chats, {
    fields: [chatMessages.chatId],
    references: [chats.id],
  }),
}));
