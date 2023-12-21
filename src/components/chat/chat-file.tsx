import { useState, useTransition } from 'react';
import Link from 'next/link';

import { deleteChatFile } from '~/lib/actions';
import { catchError, truncate } from '~/lib/utils';
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
import { Icons } from '~/components/icons';
import { LoadingButton } from '~/components/loading-button';

type Props = {
  chatId: string;
  file: {
    id: string;
    name: string;
    path: string;
  };
};

export function ChatFile({ chatId, file }: Props) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  return (
    <div key={file.id} className='flex items-center justify-between space-x-2 rounded-lg p-2 hover:bg-muted'>
      <Link href={`/${file.path}`.replace('public/', '')} target='_blank' className='flex items-center space-x-2'>
        <Icons.paperClip className='h-4 w-4' />
        <span>{truncate(file.name, 15)}</span>
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
                startTransition(async () => {
                  try {
                    await deleteChatFile(file.id, chatId);
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
    </div>
  );
}
