import { db } from '~/db';
import type { Chat, Settings } from '~/types';
import { StreamingTextResponse, type Message } from 'ai';
import { eq } from 'drizzle-orm';
import { PromptTemplate } from 'langchain/prompts';
import { BytesOutputParser } from 'langchain/schema/output_parser';

import { chatMessages } from '~/db/schema';
import { getChatModel } from '~/lib/chat-model';
import { similaritySearch } from '~/lib/vector-store';

const formatMessage = (message: Message) => {
  return `${message.role}: ${message.content}`;
};

export async function POST(request: Request) {
  try {
    const { messages, chat, settings } = (await request.json()) as {
      messages: Message[];
      chat: Chat;
      settings: Settings;
    };
    const chatModel = getChatModel({ model: settings.chat_model_name, baseUrl: settings.chat_model_base_url });
    const chatHistory = await db.query.chatMessages.findMany({
      where: eq(chatMessages.chatId, chat.id),
      columns: {
        content: true,
        role: true,
      },
    });
    let chat_history = chatHistory
      .map(message => `${message.role === 'system' ? 'Assistant' : 'User'}: ${message.content}`)
      .join('\n');
    if (!chat.save) {
      const previousMessages = messages.slice(0, -1).map(formatMessage).join('\n');
      chat_history = `${chat_history}\n${previousMessages}`;
    }
    const question = messages.at(-1)?.content ?? '';
    const context = await similaritySearch({ text: question, collectionName: chat.id, k: chat.k });
    console.log(context);

    const template = `
      You are a helpful assistant. Your job is to answer the question based only on the following context and chat history. Prioritize the context over the chat history.
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
    const chain = prompt
      .pipe(chatModel)
      .pipe(outputParser)
      .withListeners({
        async onEnd(run) {
          if (chat.save) {
            // eslint-disable-next-line
            const answer = run.child_runs.at(-1)!.inputs.lc_kwargs?.content as string;
            await db.insert(chatMessages).values({
              chatId: chat.id,
              content: answer,
              role: 'system',
            });
          }
        },
      });
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
