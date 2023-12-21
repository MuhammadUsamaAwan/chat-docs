import { OllamaEmbeddings } from 'langchain/embeddings/ollama';

export function getEmbeddingsModel({ model, baseUrl }: { model: string; baseUrl: string }) {
  return new OllamaEmbeddings({
    model,
    baseUrl,
  });
}
