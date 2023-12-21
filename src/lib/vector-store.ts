import { ChromaClient } from 'chromadb';
import type { Document } from 'langchain/document';
import { Chroma } from 'langchain/vectorstores/chroma';

import { getEmbeddingsModel } from '~/lib/embeddings';
import { getSettings } from '~/lib/fetchers';

export async function indexDocument({
  docs,
  collectionName,
}: {
  docs: Document<Record<string, unknown>>[];
  collectionName: string;
}) {
  const settings = await getSettings();
  const embeddings = getEmbeddingsModel({
    model: settings.embedding_model_name,
    baseUrl: settings.embedding_model_base_url,
  });
  await Chroma.fromDocuments(docs, embeddings, {
    collectionName,
    url: settings.chroma_url,
  });
}

export async function deleteCollection({ collectionName }: { collectionName: string }) {
  const settings = await getSettings();
  const client = new ChromaClient({
    path: settings.chroma_url,
  });
  await client.deleteCollection({
    name: collectionName,
  });
}

export async function deleteDocument({ filePath, collectionName }: { filePath: string; collectionName: string }) {
  const settings = await getSettings();
  const embeddings = getEmbeddingsModel({
    model: settings.embedding_model_name,
    baseUrl: settings.embedding_model_base_url,
  });
  const vectorStore = await Chroma.fromExistingCollection(embeddings, {
    collectionName,
    url: settings.chroma_url,
  });
  await vectorStore.delete({
    filter: {
      source: filePath,
    },
  });
}

export async function similaritySearch({
  text,
  collectionName,
  k,
}: {
  text: string;
  collectionName: string;
  k?: number;
}) {
  const settings = await getSettings();
  const embeddings = getEmbeddingsModel({
    model: settings.embedding_model_name,
    baseUrl: settings.embedding_model_base_url,
  });
  const vectorStore = await Chroma.fromExistingCollection(embeddings, {
    collectionName,
    url: settings.chroma_url,
  });
  const docs = await vectorStore.similaritySearch(text, k ?? 1);
  return docs.map(doc => doc.pageContent).join('\n');
}
