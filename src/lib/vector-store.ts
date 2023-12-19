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
