import { ChatOllama } from 'langchain/chat_models/ollama';
import { ChatOpenAI } from 'langchain/chat_models/openai';

export function getChatModel({ model, baseUrl }: { model: string; baseUrl: string }) {
  if(model === 'openai') {
    return new ChatOpenAI({
      openAIApiKey: baseUrl,
    });
  }
  return new ChatOllama({
    model,
    baseUrl,
  });
}
