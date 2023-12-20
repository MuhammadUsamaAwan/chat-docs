'use client';

import TextareaAutosize from 'react-autosize-textarea';

import { Button } from '~/components/ui/button';
import { Icons } from '~/components/icons';

export function Chat() {
  return (
    <main className='flex h-screen flex-1 flex-col py-4 pr-4'>
      <div className='flex-1'>chat messages</div>
      <form className='relative'>
        <TextareaAutosize
          placeholder='Message Chat Docs...'
          className='w-full resize-none rounded-lg border border-input bg-background p-3 ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2'
          maxRows={7}
        />
        <Button size='xs' className='absolute bottom-[15px] right-4'>
          <Icons.send className='h-5 w-5' />
        </Button>
      </form>
    </main>
  );
}
