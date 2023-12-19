import Link from 'next/link';

import { truncate } from '~/lib/utils';
import { Icons } from '~/components/icons';

import { ScrollArea } from './ui/scroll-area';

type Props = {
  chatFiles: {
    id: string;
    name: string;
    path: string;
  }[];
};

export function ChatSidebar({ chatFiles }: Props) {
  return (
    <aside className='h-screen w-64 space-y-2 border-r p-2 py-4'>
      <Link href='/' className='flex items-center space-x-2 rounded-lg p-2 hover:bg-muted'>
        <Icons.logo className='h-5 w-5' />
        <span className='font-semibold'>Chat Docs</span>
      </Link>
      <label
        htmlFor='chat-file'
        className='mx-2 block cursor-pointer rounded-lg border border-dashed px-2 py-3 text-center text-sm text-muted-foreground'
      >
        New File
      </label>
      <input id='chat-file' type='file' className='hidden' />
      <ScrollArea className='h-[calc(100dvh-158px)]'>
        {chatFiles.map(file => (
          <div key={file.id} className='flex items-center justify-between space-x-2 rounded-lg p-2 hover:bg-muted'>
            <Link href={`/${file.path}`.replace('public/', '')} target='_blank' className='flex items-center space-x-2'>
              <Icons.paperClip className='h-4 w-4' />
              <span>{truncate(file.name, 18)}</span>
            </Link>
            <Icons.trash className='h-4 w-4' />
          </div>
        ))}
      </ScrollArea>
    </aside>
  );
}
