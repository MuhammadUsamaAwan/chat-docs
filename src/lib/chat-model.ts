import { ChatOllama } from 'langchain/chat_models/ollama';

export const chatModel = new ChatOllama({
  baseUrl: 'http://localhost:11434',
  model: 'llama2',
});
