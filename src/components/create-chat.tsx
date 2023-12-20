'use client';

import { useState, useTransition } from 'react';

import { createChat } from '~/lib/actions';
import { catchError } from '~/lib/utils';
import { Button } from '~/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '~/components/ui/dialog';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';

import { LoadingButton } from './loading-button';

export function CreateChat() {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size='sm' onClick={() => setOpen(true)}>
          New Chat
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a New Chat</DialogTitle>
        </DialogHeader>
        <form
          action={formData => {
            startTransition(async () => {
              try {
                await createChat(formData);
                setOpen(false);
              } catch (error) {
                catchError(error);
              }
            });
          }}
          className='space-y-4'
        >
          <div className='space-y-1'>
            <Label htmlFor='chat-name'>Name</Label>
            <Input id='chat-name' name='name' placeholder='Chat Name' required />
          </div>
          <div className='space-y-1'>
            <Label htmlFor='chat-files'>Files</Label>
            <Input id='chat-files' name='files' type='file' multiple required />
          </div>
          <LoadingButton type='submit' className='w-full' isLoading={isPending}>
            Create Chat
          </LoadingButton>
        </form>
      </DialogContent>
    </Dialog>
  );
}
