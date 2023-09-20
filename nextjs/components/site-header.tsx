'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { cn } from '@/lib/utils';

export function SiteHeader() {
  const pathname = usePathname();

  const menuList = [
    { path: '/', name: '채팅' },
    { path: '/translate', name: '한/영 번역기' },
    { path: '/kakao', name: 'Kakao Developers Helper' },
  ];

  return (
    <header className='fixed top-0 z-40 w-full h-16 border-b'>
      <div className='flex h-full gap-6 md:gap-10 px-4 md:px-10'>
        <Link href='/' className='flex items-center text-zinc-900 hover:text-zinc-700'>
          <span className='inline-block font-bold'>챗봇</span>
        </Link>
        <nav className='flex gap-6'>
          {menuList.map((menu, i) => (
            <Link
              key={i}
              href={menu.path}
              className={cn(
                'flex items-center text-sm font-medium text-zinc-500 hover:text-zinc-700',
                pathname === menu.path && 'font-semibold text-zinc-700 hover:text-zinc-900',
              )}
            >
              {menu.name}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
