import Link from 'next/link';

import { getSettings } from '~/lib/fetchers';
import { Icons } from '~/components/icons';
import { Settings } from '~/components/settings';
import { ToggleTheme } from '~/components/toggle-theme';

export async function SiteHeader() {
  const settings = await getSettings();

  return (
    <header className='sticky top-0 z-10 w-full border-b bg-background'>
      <div className='container flex h-14 items-center justify-between'>
        <Link href='/' className='flex items-center space-x-2'>
          <Icons.logo />
          <span className='font-semibold'>Chat Docs</span>
        </Link>
        <div className='flex items-center space-x-2'>
          <Settings settings={settings} />
          <ToggleTheme />
        </div>
      </div>
    </header>
  );
}
