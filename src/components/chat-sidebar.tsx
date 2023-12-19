'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';

import { addChatFile, deleteChatFile } from '~/lib/actions';
import { catchError, cn, truncate } from '~/lib/utils';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '~/components/ui/alert-dialog';
import { ScrollArea } from '~/components/ui/scroll-area';
import { Icons } from '~/components/icons';

import { LoadingButton } from './loading-button';

type Props = {
  chatId: string;
  chatFiles: {
    id: string;
    name: string;
    path: string;
  }[];
};

export function ChatSidebar({ chatId, chatFiles }: Props) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  return (
    <aside className='h-screen w-64 space-y-2 border-r p-2 py-4'>
      <Link href='/' className='flex items-center space-x-2 rounded-lg p-2 hover:bg-muted'>
        <Icons.logo className='h-5 w-5' />
        <span className='font-semibold'>Chat Docs</span>
      </Link>
      <label
        htmlFor='chat-file'
        className={cn(
          'mx-2 block cursor-pointer rounded-lg border border-dashed px-2 py-3 text-center text-sm text-muted-foreground',
          isPending && 'cursor-not-allowed'
        )}
      >
        {isPending ? 'Adding File...' : 'New File'}
      </label>
      <input
        id='chat-file'
        type='file'
        disabled={isPending}
        className='hidden'
        onChange={e => {
          startTransition(async () => {
            try {
              const files = e.target.files;
              if (!files) return;
              const file = files[0];
              if (!file) return;
              const formData = new FormData();
              formData.append('chatId', chatId);
              formData.append('file', file);
              await addChatFile(formData);
            } catch (error) {
              catchError(error);
            }
          });
        }}
      />
      <ScrollArea className='h-[calc(100dvh-158px)]'>
        {chatFiles.map(file => (
          <div key={file.id} className='flex items-center justify-between space-x-2 rounded-lg p-2 hover:bg-muted'>
            <Link href={`/${file.path}`.replace('public/', '')} target='_blank' className='flex items-center space-x-2'>
              <Icons.paperClip className='h-4 w-4' />
              <span>{truncate(file.name, 18)}</span>
            </Link>
            <AlertDialog open={open} onOpenChange={setOpen}>
              <AlertDialogTrigger asChild>
                <button type='button'>
                  <Icons.trash className='h-4 w-4' />
                </button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will delete {file.name} permanently.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <LoadingButton
                    variant='destructive'
                    isLoading={isPending}
                    onClick={() => {
                      try {
                        startTransition(async () => {
                          await deleteChatFile(file.id, chatId);
                          setOpen(false);
                        });
                      } catch (e) {
                        catchError(e);
                      }
                    }}
                  >
                    Yes
                  </LoadingButton>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        ))}
      </ScrollArea>
    </aside>
  );
}
