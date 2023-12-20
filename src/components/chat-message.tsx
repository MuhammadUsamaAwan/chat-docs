import { type Message } from 'ai';

import { useRelativeTime } from '~/hooks/useRelativeTime';
import { Avatar, AvatarFallback } from '~/components/ui/avatar';
import { Icons } from '~/components/icons';

type Props = {
  message: Message;
};

export function ChatMessage({ message }: Props) {
  const relativeTime = useRelativeTime(message.createdAt);

  return (
    <div className='flex space-x-2'>
      <Avatar>
        <AvatarFallback>
          {message.role === 'user' ? <Icons.user className='h-5 w-5' /> : <Icons.bot className='h-5 w-5' />}
        </AvatarFallback>
      </Avatar>
      <div>
        <div className='font-semibold'>
          {message.role === 'user' ? 'You' : 'Chat Docs AI'}{' '}
          <span className='text-sm font-normal text-muted-foreground'>({relativeTime} ago)</span>
        </div>
        <div>{message.content}</div>
      </div>
    </div>
  );
}
