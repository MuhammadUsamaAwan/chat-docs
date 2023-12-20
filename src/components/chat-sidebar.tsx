'use client';

import Link from 'next/link';

import { ScrollArea } from '~/components/ui/scroll-area';
import { AddChatFile } from '~/components/add-chat-file';
import { ChatFile } from '~/components/chat-file';
import { Icons } from '~/components/icons';
import { Settings } from '~/components/settings';

type Props = {
  chat: {
    id: string;
    name: string;
    save: boolean;
    k: number;
  };
  chatFiles: {
    id: string;
    name: string;
    path: string;
  }[];
};

export function ChatSidebar({ chat, chatFiles }: Props) {
  return (
    <aside className='h-screen w-64 space-y-2 border-r p-2 py-4'>
      <Link href='/' className='flex items-center space-x-2 rounded-lg p-2 hover:bg-muted'>
        <Icons.logo className='h-5 w-5' />
        <span className='font-semibold'>Chat Docs</span>
      </Link>
      <AddChatFile chatId={chat.id} />
      <ScrollArea className='h-[calc(100dvh-158px-40px)]'>
        {chatFiles.map(file => (
          <ChatFile key={file.id} file={file} chatId={chat.id} />
        ))}
      </ScrollArea>
      <Settings chat={chat} />
    </aside>
  );
}
