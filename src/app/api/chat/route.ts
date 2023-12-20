import { StreamingTextResponse, type Message as VercelChatMessage } from 'ai';
import { PromptTemplate } from 'langchain/prompts';
import { BytesOutputParser } from 'langchain/schema/output_parser';

import { chatModel } from '~/lib/chat-model';
import { similaritySearch } from '~/lib/vector-store';

const formatMessage = (message: VercelChatMessage) => {
  return `${message.role}: ${message.content}`;
};

export async function POST(reques: Request) {
  try {
    const { messages, chatId } = (await reques.json()) as { messages: VercelChatMessage[]; chatId: string };
    const chat_history = messages.slice(0, -1).map(formatMessage).join('\n');
    const question = messages.at(-1)?.content ?? '';
    const context = await similaritySearch({ text: question, collectionName: chatId });
    console.log(context);
    console.log(chat_history);

    const template = `
      Answer the question based only on the following context and chat history, prioritize the context over the chat history.
      <context>
        {context}
      </context>

      <chat_history>
        {chat_history}
      </chat_history>

      Question: {question}
    `;

    const prompt = PromptTemplate.fromTemplate(template);
    const outputParser = new BytesOutputParser();
    const chain = prompt.pipe(chatModel).pipe(outputParser);
    const stream = await chain.stream({
      chat_history,
      context,
      question,
    });

    return new StreamingTextResponse(stream);
  } catch (error) {
    console.log(error);
    throw new Error('Something went wrong, please try again later.');
  }
}
