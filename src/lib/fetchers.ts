import { db } from '~/db';
import { eq } from 'drizzle-orm';

import { chatMessages, chats } from '~/db/schema';

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
      model: true,
      baseUrl: true,
      save: true,
      k: true,
    },
    with: {
      chatFiles: {
        columns: {
          id: true,
          name: true,
          path: true,
        },
      },
      chatMessages: {
        columns: {
          id: true,
          content: true,
          role: true,
          createdAt: true,
        },
      },
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
