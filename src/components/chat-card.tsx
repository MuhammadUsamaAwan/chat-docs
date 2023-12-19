'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';

import { deleteChat } from '~/lib/actions';
import { catchError, formatDate } from '~/lib/utils';
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
import { Button, buttonVariants } from '~/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '~/components/ui/card';
import { Icons } from '~/components/icons';
import { LoadingButton } from '~/components/loading-button';

type Props = {
  chat: {
    id: string;
    name: string;
    createdAt: Date;
    chatFiles: {
      id: string;
      name: string;
      path: string;
    }[];
  };
};

export function ChatCard({ chat }: Props) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  return (
    <Card key={chat.id}>
      <CardHeader className='pb-4'>
        <CardTitle>{chat.name}</CardTitle>
        <CardDescription>{formatDate(chat.createdAt)}</CardDescription>
      </CardHeader>
      <CardContent className='pb-4'>
        <div>
          {chat.chatFiles.map(file => (
            <Link
              href={file.path.replace('public/', '')}
              target='_blank'
              key={file.id}
              className='flex items-center gap-2'
            >
              <Icons.paperClip className='h-4 w-4' />
              <span>{file.name}</span>
            </Link>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Link
          href={`/${chat.id}`}
          className={buttonVariants({
            size: 'sm',
          })}
        >
          Go to Chat
        </Link>
        <AlertDialog open={open} onOpenChange={setOpen}>
          <AlertDialogTrigger asChild>
            <Button variant='destructive' size='sm' className='ml-2'>
              Delete Chat
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your chat data.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <LoadingButton
                variant='destructive'
                isLoading={isPending}
                onClick={() => {
                  startTransition(async () => {
                    try {
                      await deleteChat(chat.id);
                      setOpen(false);
                    } catch (e) {
                      catchError(e);
                    }
                  });
                }}
              >
                Yes
              </LoadingButton>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardFooter>
    </Card>
  );
}
