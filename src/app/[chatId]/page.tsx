import { notFound } from 'next/navigation';

import { getChat } from '~/lib/fetchers';
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
    <div>
      <ChatSidebar chatFiles={chat.chatFiles} />
    </div>
  );
}
