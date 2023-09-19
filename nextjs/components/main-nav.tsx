import * as React from 'react';
import Link from 'next/link';

import { cn } from '@/lib/utils';

export function MainNav() {
  return (
    <div className='flex gap-6 md:gap-10'>
      <Link href='/' className='flex items-center space-x-2 text-zinc-900 hover:text-zinc-700'>
        <span className='inline-block font-bold'>챗봇</span>
      </Link>
      <nav className='flex gap-6'>
        <Link
          href='/'
          className={cn('flex items-center text-sm font-medium text-zinc-500 hover:text-zinc-700')}
        >
          채팅
        </Link>
        <Link
          href='/translate'
          className={cn('flex items-center text-sm font-medium text-zinc-500 hover:text-zinc-700')}
        >
          한/영 번역기
        </Link>
        <Link
          href='/'
          className={cn('flex items-center text-sm font-medium text-zinc-500 hover:text-zinc-700')}
        >
          Kakao Developers Helper
        </Link>
      </nav>
    </div>
  );
}
