'use client';

import { useTransition } from 'react';
import type { Settings } from '~/types';

import { updateSettings } from '~/lib/actions';
import { catchError } from '~/lib/utils';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { LoadingButton } from '~/components/loading-button';

type Props = {
  onSave?: () => void;
  initialValues: Settings;
};

export function SettingsForm({
  onSave,
  initialValues: { chat_model_name, chat_model_base_url, embedding_model_name, embedding_model_base_url, chroma_url },
}: Props) {
  const [isPending, startTransition] = useTransition();

  return (
    <form
      action={formData => {
        startTransition(async () => {
          try {
            await updateSettings(formData);
            if (onSave) {
              onSave();
            }
          } catch (error) {
            catchError(error);
          }
        });
      }}
      className='space-y-4'
    >
      <div className='space-y-1'>
        <Label htmlFor='chat_model_name'>Chat Model Name</Label>
        <Input
          id='chat_model_name'
          name='chat_model_name'
          placeholder='Chat Model Name'
          defaultValue={chat_model_name}
          required
        />
      </div>
      <div className='space-y-1'>
        <Label htmlFor='chat_model_base_url'>Chat Model Base Url</Label>
        <Input
          id='chat_model_base_url'
          name='chat_model_base_url'
          placeholder='Chat Model Base Url'
          defaultValue={chat_model_base_url}
          required
        />
      </div>
      <div className='space-y-1'>
        <Label htmlFor='embedding_model_name'>Embeddings Model Name</Label>
        <Input
          id='embedding_model_name'
          name='embedding_model_name'
          placeholder='Embeddings Model Name'
          defaultValue={embedding_model_name}
          required
        />
      </div>
      <div className='space-y-1'>
        <Label htmlFor='embedding_model_base_url'>Embeddings Model Base Url</Label>
        <Input
          id='embedding_model_base_url'
          name='embedding_model_base_url'
          placeholder='Embeddings Model Base Url'
          defaultValue={embedding_model_base_url}
          required
        />
      </div>
      <div className='space-y-1'>
        <Label htmlFor='chroma_url'>Chroma Url</Label>
        <Input id='chroma_url' name='chroma_url' placeholder='Chroma Url' defaultValue={chroma_url} required />
      </div>
      <LoadingButton type='submit' className='w-full' isLoading={isPending}>
        Save Changes
      </LoadingButton>
    </form>
  );
}
