import { useTransition } from 'react';

import { addChatFile } from '~/lib/actions';
import { catchError, cn } from '~/lib/utils';

type Props = {
  chatId: string;
};

export function AddChatFile({ chatId }: Props) {
  const [isPending, startTransition] = useTransition();

  return (
    <>
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
    </>
  );
}
