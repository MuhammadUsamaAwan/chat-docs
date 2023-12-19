'use client';

import { Toaster as SonnerToaster } from 'sonner';

export function Toaster() {
  return (
    <SonnerToaster
      position='bottom-right'
      toastOptions={{
        unstyled: true,
        classNames: {
          error: 'bg-destructive text-destructive-foreground',
        },
        className: 'flex w-full items-center gap-3 rounded-lg border bg-background p-4 text-sm text-foreground',
      }}
    />
  );
}
