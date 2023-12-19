import { db } from '~/db';
import { eq } from 'drizzle-orm';

import { chats } from '~/db/schema';

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
    columns: {},
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
