'use server';

import { mkdir, rm, unlink, writeFile } from 'fs/promises';
import { revalidatePath } from 'next/cache';
import { db } from '~/db';
import { and, eq } from 'drizzle-orm';

import { chatFiles, chats } from '~/db/schema';
import { pdfLoader } from '~/lib/document-loaders';
import { addDocument, deleteCollection, deleteDocument, indexDocument } from '~/lib/vector-store';

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
  revalidatePath(`/chats/${chat.id}`);
}

export async function deleteChat(id: string) {
  await db.delete(chats).where(eq(chats.id, id));
  await rm(`public/${id}`, { recursive: true });
  await deleteCollection({ collectionName: id });
  revalidatePath('/');
}

export async function addChatFile(formData: FormData) {
  const chatId = formData.get('chatId') as string;
  const file = formData.get('file') as File;
  console.log(chatId, file);
  const existingFile = await db.query.chatFiles.findFirst({
    where: and(eq(chatFiles.chatId, chatId), eq(chatFiles.name, file.name)),
  });
  if (existingFile) {
    throw new Error('File already exists');
  }
  const filePath = `public/${chatId}/${file.name}`;
  await mkdir(`public/${chatId}`, { recursive: true });
  const fileBuffer = await file.arrayBuffer();
  await Promise.all([
    writeFile(filePath, Buffer.from(fileBuffer)),
    db.insert(chatFiles).values({ chatId, name: file.name, path: filePath }),
  ]);
  const docs = await pdfLoader(filePath);
  console.log(docs.length);
  await addDocument({ docs, collectionName: chatId });
  revalidatePath('/');
  revalidatePath(`/chats/${chatId}`);
}

export async function deleteChatFile(id: string, chatId: string) {
  // const [chatFile] = await db.delete(chatFiles).where(eq(chatFiles.id, id)).returning({ name: chatFiles.name });
  // if (!chatFile) {
  //   throw new Error('Unable to delete file, please try again later');
  // }
  // const filePath = `public/${chatId}/${chatFile.name}`;
  // await unlink(filePath);
  // await deleteDocument({ filePath, collectionName: chatId });
  await deleteDocument({
    filePath: 'public/9525f500-ad59-4c00-b933-94e68b71ab68/Fashion Brand.pdf',
    collectionName: chatId,
  });
  // revalidatePath('/dashboard');
  // revalidatePath(`/chats/${chatId}`);
}
