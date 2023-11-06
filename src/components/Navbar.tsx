'use client';

import Link from 'next/link';
import { Icons } from './Icons';
import { UserSessionNav } from '@/components/UserSessionNav';
import { useEffect, useState } from 'react';

const Navbar = () => {
  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    isMounted && (
      <div
        className='fixed top-0 inset-x-0 h-fit
       border-zinc-300 z-[10] py-2 backdrop-blur-md bg-opacity-70 shadow-md'
      >
        <div
          className='container max-w-7xl h-full mx-auto flex items-center 
        justify-between gap-2'
        >
          <Link href='/' className='flex gap-2 items-center'>
            <Icons.logo name='logo' />
          </Link>

          <Link
            href='/portfolio'
            className='text-md font-bold text-primary'
          >
            Portfolio
          </Link>

          <div className='flex gap-2 items-center'>
            <UserSessionNav />
          </div>
        </div>
      </div>
    )
  );
};

export default Navbar;
