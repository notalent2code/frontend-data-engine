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
        className='fixed top-0 inset-x-0 h-fit z-[10] py-2 px-10 backdrop-blur-md 
        bg-opacity-70 shadow-md overflow-x-hidden'
      >
        <div className='container w-full h-full flex justify-between'>
          <Link href='/'>
            <Icons.logo name='logo' />
          </Link>
          <UserSessionNav />
        </div>
      </div>
    )
  );
};

export default Navbar;
