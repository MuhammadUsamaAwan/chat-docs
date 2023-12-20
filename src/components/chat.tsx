'use client';

import { useRef } from 'react';
import { useChat } from 'ai/react';
import TextareaAutosize from 'react-autosize-textarea';

import { Button } from '~/components/ui/button';
import { ChatMessage } from '~/components/chat-message';
import { Icons } from '~/components/icons';

type Props = {
  chatId: string;
};

export function Chat({ chatId }: Props) {
  const formRef = useRef<HTMLFormElement>(null);
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    body: { chatId },
  });

  return (
    <main className='flex h-screen flex-1 flex-col py-4 pr-4'>
      <div className='flex-1 space-y-8 overflow-y-scroll'>
        {messages.map(message => (
          <ChatMessage key={message.id} message={message} />
        ))}
      </div>
      <form onSubmit={handleSubmit} ref={formRef} className='relative'>
        <TextareaAutosize
          value={input}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleInputChange(e)}
          placeholder='Message Chat Docs...'
          className='w-full resize-none rounded-lg border border-input bg-background p-3 ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2'
          maxRows={7}
          onKeyDown={e => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              formRef.current?.requestSubmit();
            }
          }}
        />
        <Button size='xs' className='absolute bottom-[15px] right-4' disabled={isLoading}>
          {isLoading ? <Icons.spinner className='h-5 w-5 animate-spin' /> : <Icons.send className='h-5 w-5' />}
        </Button>
      </form>
    </main>
  );
}
