import Link from 'next/link';

import { Icons } from '~/components/icons';
import { ToggleTheme } from '~/components/toggle-theme';

export function SiteHeader() {
  return (
    <header className='sticky top-0 z-10 w-full border-b bg-background'>
      <div className='container flex h-14 items-center justify-between'>
        <Link href='/' className='flex items-center space-x-2'>
          <Icons.logo />
          <span className='font-semibold'>Chat Docs</span>
        </Link>
        <ToggleTheme />
      </div>
    </header>
  );
}
