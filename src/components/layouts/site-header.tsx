import Link from 'next/link';

import { getSettings } from '~/lib/fetchers';
import { Icons } from '~/components/icons';
import { Settings } from '~/components/layouts/settings';
import { ToggleTheme } from '~/components/layouts/toggle-theme';

import { buttonVariants } from '../ui/button';

export async function SiteHeader() {
  const settings = await getSettings();

  return (
    <header className='sticky top-0 z-10 w-full border-b bg-background'>
      <div className='container flex h-14 items-center justify-between'>
        <Link href='/' className='flex items-center space-x-2'>
          <Icons.logo />
          <span className='font-semibold'>ChatDocs</span>
        </Link>
        <div className='flex items-center space-x-2'>
          <Link href='/comparison' className={buttonVariants({ size: 'icon', variant: 'ghost' })}>
            <Icons.info />
          </Link>
          <Settings settings={settings} />
          <ToggleTheme />
        </div>
      </div>
    </header>
  );
}
