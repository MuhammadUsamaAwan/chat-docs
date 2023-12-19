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
  console.log(filePath);
  const docs = await vectorStore.similaritySearch('fashion brand', 1);
  console.log(
    JSON.stringify(
      docs.map(doc => doc.metadata),
      null,
      2
    )
  );
  console.log('before', await vectorStore.collection?.count());
  await vectorStore.delete({
    filter: {
      source: filePath,
    },
  });
  console.log('after', await vectorStore.collection?.count());
}
