import { useTransition } from 'react';
import type { Chat } from '~/types';

import { updateChat } from '~/lib/actions';
import { catchError } from '~/lib/utils';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select';
import { LoadingButton } from '~/components/loading-button';

type Props = {
  onSave: () => void;
  chat: Chat;
};

export function UpdateChatForm({ onSave, chat }: Props) {
  const [isPending, startTransition] = useTransition();
  return (
    <form
      className='space-y-4'
      action={formData => {
        startTransition(async () => {
          try {
            formData.append('id', chat.id);
            await updateChat(formData);
            onSave();
          } catch (error) {
            catchError(error);
          }
        });
      }}
    >
      <div className='space-y-1'>
        <Label htmlFor='chat-name'>Chat Name</Label>
        <Input name='name' id='chat-name' defaultValue={chat.name} />
      </div>
      <div className='space-y-1'>
        <Label>Save Messages</Label>
        <Select name='save' defaultValue={chat.save ? 'yes' : 'no'}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='yes'>Yes</SelectItem>
            <SelectItem value='no'>No</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className='space-y-1'>
        <Label htmlFor='k'>No of Pages for Context</Label>
        <Input id='k' name='k' type='number' inputMode='numeric' defaultValue={chat.k} min={1} />
      </div>
      <LoadingButton type='submit' className='w-full' isLoading={isPending}>
        Save Changes
      </LoadingButton>
    </form>
  );
}
