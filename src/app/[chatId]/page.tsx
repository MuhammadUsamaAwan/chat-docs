import { notFound } from 'next/navigation';

import { getChat } from '~/lib/fetchers';
import { Chat } from '~/components/chat';
import { ChatSidebar } from '~/components/chat-sidebar';

type Props = {
  params: {
    chatId: string;
  };
};

export default async function ChatPage({ params: { chatId } }: Props) {
  const chat = await getChat(chatId);

  if (!chat) {
    notFound();
  }

  return (
    <div className='flex space-x-4'>
      <ChatSidebar chatId={chatId} chatFiles={chat.chatFiles} />
      <Chat />
    </div>
  );
}
