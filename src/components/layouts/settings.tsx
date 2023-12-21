'use client';

import { useState } from 'react';
import type { Settings } from '~/types';

import { Button } from '~/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '~/components/ui/dialog';
import { Icons } from '~/components/icons';

import { SettingsForm } from '../forms/settings-form';

type Props = {
  settings: Settings;
};

export function Settings({ settings }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size='icon' variant='ghost'>
          <Icons.settings />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Settings</DialogTitle>
        </DialogHeader>
        <SettingsForm initialValues={settings} onSave={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
