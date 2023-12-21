'use server';

import { mkdir, rm, unlink, writeFile } from 'fs/promises';
import { revalidatePath } from 'next/cache';
import { db } from '~/db';
import { and, eq } from 'drizzle-orm';

import { chatFiles, chatMessages, chats, settings } from '~/db/schema';
import { loadDocument } from '~/lib/document-loader';
import { deleteCollection, deleteDocument, indexDocument } from '~/lib/vector-store';

export async function createChat(formData: FormData) {
  const name = formData.get('name') as string;
  const files = formData.getAll('files') as File[];
  const save = (formData.get('save') as string) === 'yes';
  const k = parseInt(formData.get('k') as string);
  const [chat] = await db.insert(chats).values({ name, save, k }).returning({ id: chats.id });
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
    const docs = await loadDocument(`${basePath}/${file.name}`);
    return indexDocument({ docs, collectionName: chat.id });
  });
  await Promise.all(indexDocumentsPromises);
  revalidatePath('/');
  revalidatePath(`/${chat.id}`);
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
  const docs = await loadDocument(filePath);
  await indexDocument({ docs, collectionName: chatId });
  revalidatePath('/');
  revalidatePath(`/${chatId}`);
}

export async function deleteChatFile(id: string, chatId: string) {
  const [chatFile] = await db.delete(chatFiles).where(eq(chatFiles.id, id)).returning({ name: chatFiles.name });
  if (!chatFile) {
    throw new Error('Unable to delete file, please try again later');
  }
  const filePath = `public/${chatId}/${chatFile.name}`;
  await Promise.all([unlink(filePath), deleteDocument({ filePath, collectionName: chatId })]);
  revalidatePath('/');
  revalidatePath(`/chats/${chatId}`);
}

export async function addChatMessage({ chatId, content }: { chatId: string; content: string }) {
  await db.insert(chatMessages).values({ chatId, content, role: 'user' });
}

export async function updateChat(formData: FormData) {
  const id = formData.get('id') as string;
  const name = formData.get('name') as string;
  const save = (formData.get('save') as string) === 'yes';
  const k = parseInt(formData.get('k') as string);
  await db.update(chats).set({ name, save, k }).where(eq(chats.id, id));
  revalidatePath('/');
  revalidatePath(`/${id}`);
}

export async function updateSettings(formData: FormData) {
  const chat_model_name = formData.get('chat_model_name') as string;
  const chat_model_base_url = formData.get('chat_model_base_url') as string;
  const embedding_model_name = formData.get('embedding_model_name') as string;
  const embedding_model_base_url = formData.get('embedding_model_base_url') as string;
  const vector_store_url = formData.get('vector_store_url') as string;

  await Promise.all([
    db
      .insert(settings)
      .values({ name: 'chat_model_name', value: chat_model_name })
      .onConflictDoUpdate({ target: settings.name, set: { value: chat_model_name } }),
    db
      .insert(settings)
      .values({ name: 'chat_model_base_url', value: chat_model_base_url })
      .onConflictDoUpdate({ target: settings.name, set: { value: chat_model_base_url } }),
    db
      .insert(settings)
      .values({ name: 'embedding_model_name', value: embedding_model_name })
      .onConflictDoUpdate({ target: settings.name, set: { value: embedding_model_name } }),
    db
      .insert(settings)
      .values({ name: 'embedding_model_base_url', value: embedding_model_base_url })
      .onConflictDoUpdate({ target: settings.name, set: { value: embedding_model_base_url } }),
    db
      .insert(settings)
      .values({ name: 'vector_store_url', value: vector_store_url })
      .onConflictDoUpdate({ target: settings.name, set: { value: vector_store_url } }),
  ]);
  revalidatePath('/');
  revalidatePath('/chat/[chatId]', 'page');
}
