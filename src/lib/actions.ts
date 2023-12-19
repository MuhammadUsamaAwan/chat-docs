'use server';

import { mkdir, rm, writeFile } from 'fs/promises';
import { revalidatePath } from 'next/cache';
import { db } from '~/db';
import { eq } from 'drizzle-orm';

import { chatFiles, chats } from '~/db/schema';
import { pdfLoader } from '~/lib/document-loaders';
import { deleteCollection, indexDocument } from '~/lib/vector-store';

export async function createChat(formData: FormData) {
  const name = formData.get('name') as string;
  const files = formData.getAll('files') as File[];
  const [chat] = await db.insert(chats).values({ name }).returning({ id: chats.id });
  if (!chat) {
    throw new Error('Unable to create chat, please try again later');
  }
  const basePath = `public/${chat.id}`;
  await mkdir(basePath, { recursive: true });
  const saveFilesPromises = files.map(async file => {
    const fileBuffer = await file.arrayBuffer();
    await writeFile(`${basePath}/${file.name}`, Buffer.from(fileBuffer));
  });
  const chatFilesPromises = files.map(file => {
    return db.insert(chatFiles).values({ chatId: chat.id, name: file.name, path: `${basePath}/${file.name}` });
  });
  await Promise.all([...saveFilesPromises, ...chatFilesPromises]);
  const indexDocumentsPromises = files.map(async file => {
    const docs = await pdfLoader(`${basePath}/${file.name}`);
    return indexDocument({ docs, collectionName: chat.id });
  });
  await Promise.all(indexDocumentsPromises);
  revalidatePath('/');
}

export async function deleteChat(id: string) {
  await db.delete(chats).where(eq(chats.id, id));
  await rm(`public/${id}`, { recursive: true });
  await deleteCollection({ collectionName: id });
  revalidatePath('/');
}
