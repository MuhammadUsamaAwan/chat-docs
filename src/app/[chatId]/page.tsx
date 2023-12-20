import { notFound } from 'next/navigation';

import { getChat, getChatMessages } from '~/lib/fetchers';
import { Chat } from '~/components/chat';
import { ChatSidebar } from '~/components/chat-sidebar';

type Props = {
  params: {
    chatId: string;
  };
};

export default async function ChatPage({ params: { chatId } }: Props) {
  const [chat, chatMessages] = await Promise.all([getChat(chatId), getChatMessages(chatId)]);

  if (!chat) {
    notFound();
  }

  return (
    <div className='flex space-x-4'>
      <ChatSidebar chatId={chatId} chatFiles={chat.chatFiles} />
      <Chat chatId={chatId} initialMessages={chatMessages} />
    </div>
  );
}
