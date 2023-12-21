import Link from 'next/link';
import { notFound } from 'next/navigation';

import { getChat, getChatFiles, getChatMessages, getSettings } from '~/lib/fetchers';
import { Button } from '~/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '~/components/ui/sheet';
import { Chat } from '~/components/chat';
import { ChatSidebar } from '~/components/chat-sidebar';
import { Icons } from '~/components/icons';

type Props = {
  params: {
    chatId: string;
  };
};

export default async function ChatPage({ params: { chatId } }: Props) {
  const [chat, chatFiles, chatMessages, settings] = await Promise.all([
    getChat(chatId),
    getChatFiles(chatId),
    getChatMessages(chatId),
    getSettings(),
  ]);

  if (!chat) {
    notFound();
  }

  return (
    <div className='flex flex-col sm:flex-row'>
      <div className='sticky top-0 z-10 flex h-14 items-center justify-between border-b bg-background px-4 sm:hidden'>
        <Link href='/' className='flex items-center space-x-2'>
          <Icons.logo />
          <span className='font-semibold'>ChatDocs</span>
        </Link>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant='ghost' size='icon'>
              <Icons.menu />
            </Button>
          </SheetTrigger>
          <SheetContent side='left' className='space-y-2'>
            <ChatSidebar chat={chat} chatFiles={chatFiles} settings={settings} />
          </SheetContent>
        </Sheet>
      </div>
      <aside className='hidden h-screen w-64 space-y-2 border-r p-2 py-4 sm:block'>
        <ChatSidebar chat={chat} chatFiles={chatFiles} settings={settings} />
      </aside>
      <Chat chat={chat} initialMessages={chatMessages} settings={settings} />
    </div>
  );
}
