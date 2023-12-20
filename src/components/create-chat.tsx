'use client';

import { useState, useTransition } from 'react';

import { createChat } from '~/lib/actions';
import { catchError } from '~/lib/utils';
import { Button } from '~/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '~/components/ui/dialog';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select';

import { LoadingButton } from './loading-button';

export function CreateChat() {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size='sm'>New Chat</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a New Chat</DialogTitle>
          <DialogDescription>You can add more files and change settings later.</DialogDescription>
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
            <Label htmlFor='model'>Model Name</Label>
            <Input id='model' name='model' defaultValue='llama2' placeholder='Model Name' required />
          </div>
          <div className='space-y-1'>
            <Label htmlFor='model-base-url'>Model Base Url</Label>
            <Input
              id='model-base-url'
              name='baseUrl'
              defaultValue='http://localhost:11434'
              placeholder='Model Base Url'
              required
            />
          </div>
          <div className='space-y-1'>
            <Label htmlFor='chat-files'>Files</Label>
            <Input id='chat-files' name='files' type='file' multiple required />
          </div>
          <div className='space-y-1'>
            <Label>Save Chats</Label>
            <Select name='save' defaultValue='yes'>
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
            <Select name='k' defaultValue='1'>
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
