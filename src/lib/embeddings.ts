import { OllamaEmbeddings } from 'langchain/embeddings/ollama';

export const embeddings = new OllamaEmbeddings({
  model: 'llama2',
  baseUrl: 'http://localhost:11434',
});
