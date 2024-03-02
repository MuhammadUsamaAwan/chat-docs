import { OllamaEmbeddings } from 'langchain/embeddings/ollama';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';

export function getEmbeddingsModel({ model, baseUrl }: { model: string; baseUrl: string }) {
  if (model === 'openai') {
    return new OpenAIEmbeddings({
      openAIApiKey: baseUrl,
    });
  }
  return new OllamaEmbeddings({
    model,
    baseUrl,
  });
}
