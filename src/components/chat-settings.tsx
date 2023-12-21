'use client';

import { useState } from 'react';
import type { Chat, Settings } from '~/types';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '~/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs';
import { SettingsForm } from '~/components/forms/settings-form';
import { UpdateChatForm } from '~/components/forms/update-chat-form';
import { Icons } from '~/components/icons';

type Props = {
  chat: Chat;
  settings: Settings;
};

export function ChatSettings({ chat, settings }: Props) {
  const [open, setOpen] = useState(false);

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
        <Tabs defaultValue='chat-settings'>
          <TabsList className='w-full'>
            <TabsTrigger value='chat-settings' className='flex-1'>
              Chat Settings
            </TabsTrigger>
            <TabsTrigger value='global-settings' className='flex-1'>
              Global Settings
            </TabsTrigger>
          </TabsList>
          <TabsContent value='chat-settings' className='pt-2'>
            <UpdateChatForm onSave={() => setOpen(false)} chat={chat} />
          </TabsContent>
          <TabsContent value='global-settings'>
            <SettingsForm onSave={() => setOpen(false)} initialValues={settings} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
