import type { Metadata } from 'next';

import { fontSans } from '~/lib/fonts';
import { cn } from '~/lib/utils';
import { Toaster } from '~/components/ui/toaster';
import { ThemeProvider } from '~/components/theme-provider';

import '~/styles/globals.css';

export const metadata: Metadata = {
  title: {
    default: 'Chat Docs',
    template: `%s - Chat Docs`,
  },
  description: 'Upload documents and ask questions with AI',
};

export default function RootLayout({ children }: React.PropsWithChildren) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body className={cn('flex min-h-screen flex-col font-sans antialiased', fontSans.variable)}>
        <ThemeProvider attribute='class' defaultTheme='dark' enableSystem disableTransitionOnChange>
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
