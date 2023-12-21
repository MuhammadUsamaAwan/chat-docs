import { db } from '~/db';
import { eq, inArray } from 'drizzle-orm';

import { chatFiles, chatMessages, chats, settings } from '~/db/schema';

export async function getChats() {
  return db.query.chats.findMany({
    columns: {
      id: true,
      name: true,
      createdAt: true,
    },
    with: {
      chatFiles: {
        columns: {
          id: true,
          name: true,
          path: true,
        },
      },
    },
  });
}

export async function getChat(id: string) {
  return db.query.chats.findFirst({
    where: eq(chats.id, id),
    columns: {
      id: true,
      name: true,
      save: true,
      k: true,
    },
  });
}

export async function getChatFiles(chatId: string) {
  return db.query.chatFiles.findMany({
    where: eq(chatFiles.chatId, chatId),
    columns: {
      id: true,
      name: true,
      path: true,
    },
  });
}

export async function getChatMessages(chatId: string) {
  return db.query.chatMessages.findMany({
    where: eq(chatMessages.chatId, chatId),
    columns: {
      id: true,
      role: true,
      content: true,
      createdAt: true,
    },
  });
}

export async function getSettings() {
  const keys = [
    'chat_model_name',
    'chat_model_base_url',
    'embedding_model_name',
    'embedding_model_base_url',
    'chroma_url',
  ];
  const _settings = await db.query.settings.findMany({
    where: inArray(settings.name, keys),
    columns: {
      name: true,
      value: true,
    },
  });
  return {
    chat_model_name: _settings.find(e => e.name === 'chat_model_name')?.value ?? 'llama2',
    chat_model_base_url: _settings.find(e => e.name === 'chat_model_base_url')?.value ?? 'http://localhost:11434',
    embedding_model_name: _settings.find(e => e.name === 'embedding_model_name')?.value ?? 'llama2',
    embedding_model_base_url:
      _settings.find(e => e.name === 'embedding_model_base_url')?.value ?? 'http://localhost:11434',
    chroma_url: _settings.find(e => e.name === 'chroma_url')?.value ?? 'http://localhost:8000',
  };
}
