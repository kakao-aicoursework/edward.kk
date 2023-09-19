import '@/app/globals.css';

import { fontMono, fontSans } from '@/lib/fonts';
import { cn } from '@/lib/utils';
import { SiteHeader } from '@/components/site-header';

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <>
      <html lang='ko' suppressHydrationWarning>
        <head />
        <body
          className={cn(
            'h-screen bg-background font-sans antialiased',
            fontSans.variable,
            fontMono.variable,
          )}
        >
          <div className='relative flex h-screen flex-col'>
            <SiteHeader />
            <div className='flex-1'>{children}</div>
          </div>
        </body>
      </html>
    </>
  );
}
