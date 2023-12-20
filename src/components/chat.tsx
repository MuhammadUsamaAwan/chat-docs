'use client';

import { useEffect, useRef } from 'react';
import { useChat, type Message } from 'ai/react';
import TextareaAutosize from 'react-autosize-textarea';

import { addChatMessage } from '~/lib/actions';
import { useIsScrolledToBottom } from '~/hooks/useIsScrolledToBottom';
import { Button } from '~/components/ui/button';
import { ChatMessage } from '~/components/chat-message';
import { Icons } from '~/components/icons';

type Props = {
  chat: {
    id: string;
    name: string;
    save: boolean;
    k: number;
  };
  initialMessages?: Message[];
};

export function Chat({ chat, initialMessages }: Props) {
  const messagesRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const { messages, input, handleInputChange, handleSubmit, isLoading, stop } = useChat({
    body: { chatId: chat.id, saveMessages: chat.save, k: chat.k },
    initialMessages,
  });
  const isAtBottom = useIsScrolledToBottom(messagesRef);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  useEffect(() => {
    if (messagesEndRef.current && isAtBottom) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  return (
    <main className='flex h-screen flex-1 flex-col p-4'>
      <div ref={messagesRef} className='mb-4 flex-1 space-y-8 overflow-y-scroll pr-4'>
        {messages.map(message => (
          <ChatMessage key={message.id} message={message} />
        ))}
        <div ref={messagesEndRef}></div>
      </div>
      <form
        onSubmit={e => {
          e.preventDefault();
          if (chat.save) {
            void addChatMessage({ chatId: chat.id, content: input });
          }
          handleSubmit(e);
        }}
        ref={formRef}
        className='relative'
      >
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
        {!isLoading ? (
          <Button size='xs' className='absolute bottom-[15px] right-4'>
            <Icons.send className='h-5 w-5' />
          </Button>
        ) : (
          <Button size='xs' className='absolute bottom-[15px] right-4' type='button' onClick={stop}>
            <Icons.stop className='h-5 w-5' />
          </Button>
        )}
      </form>
    </main>
  );
}
