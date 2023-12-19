import type { Document } from 'langchain/document';
import { Chroma } from 'langchain/vectorstores/chroma';

import { embeddings } from '~/lib/embeddings';

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
