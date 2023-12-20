import { useState, useTransition } from 'react';
import { useTheme } from 'next-themes';

import { updateChat } from '~/lib/actions';
import { catchError } from '~/lib/utils';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '~/components/ui/dialog';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select';
import { Icons } from '~/components/icons';
import { LoadingButton } from '~/components/loading-button';

type Props = {
  chat: {
    id: string;
    name: string;
    save: boolean;
    k: number;
  };
};

export function Settings({ chat }: Props) {
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className='flex w-full items-center space-x-2 rounded-lg p-2 hover:bg-muted'>
          <Icons.settings className='h-5 w-5' />
          <span>Settings</span>
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
        </DialogHeader>
        <form
          className='space-y-4'
          action={formData => {
            startTransition(async () => {
              try {
                formData.append('id', chat.id);
                await updateChat(formData);
                setOpen(false);
              } catch (error) {
                catchError(error);
              }
            });
          }}
        >
          <div className='space-y-1'>
            <Label>Theme</Label>
            <Select value={theme} onValueChange={val => setTheme(val)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='light'>Light</SelectItem>
                <SelectItem value='dark'>Dark</SelectItem>
                <SelectItem value='system'>System</SelectItem>
              </SelectContent>
            </Select>
          </div>
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
            <Label>No of Pages for Context</Label>
            <Select name='k' defaultValue={String(chat.k)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='1'>One</SelectItem>
                <SelectItem value='2'>Two</SelectItem>
                <SelectItem value='3'>Three</SelectItem>
                <SelectItem value='4'>Four</SelectItem>
                <SelectItem value='5'>Five</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <LoadingButton type='submit' className='w-full' isLoading={isPending}>
            Create Chat
          </LoadingButton>
        </form>
      </DialogContent>
    </Dialog>
  );
}
