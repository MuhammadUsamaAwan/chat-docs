import { ChromaClient } from 'chromadb';
import type { Document } from 'langchain/document';
import { Chroma } from 'langchain/vectorstores/chroma';

import { embeddings } from '~/lib/embeddings';

const client = new ChromaClient();

export async function indexDocument({
  docs,
  collectionName,
}: {
  docs: Document<Record<string, unknown>>[];
  collectionName: string;
}) {
  await Chroma.fromDocuments(docs, embeddings, {
    collectionName,
  });
}

export async function deleteCollection({ collectionName }: { collectionName: string }) {
  await client.deleteCollection({
    name: collectionName,
  });
}

export async function deleteDocument({ filePath, collectionName }: { filePath: string; collectionName: string }) {
  const vectorStore = await Chroma.fromExistingCollection(embeddings, {
    collectionName,
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
  const vectorStore = await Chroma.fromExistingCollection(embeddings, {
    collectionName,
  });
  const docs = await vectorStore.similaritySearch(text, k ?? 1);
  return docs.map(doc => doc.pageContent).join('\n');
}
