'use client';

import Link from 'next/link';
import { Icons } from './Icons';
import { UserSessionNav } from '@/components/UserSessionNav';
import { FC, useEffect, useState } from 'react';
import NavigationDropdown from '@/components/NavigationDropdown';

interface NavbarProps {
  logo: boolean;
}

const Navbar: FC<NavbarProps> = ({ logo }) => {
  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    isMounted &&
    (logo ? (
      <div
        className='fixed top-0 inset-x-0 h-fit z-[10] py-2 px-10 backdrop-blur-md 
          bg-white bg-opacity-10 shadow-md'
      >
        <div className='sm:container max-w-7xl h-full flex justify-between items-center'>
          <Link href='/'>
            <Icons.logo name='logo' />
          </Link>
          <UserSessionNav />
        </div>
      </div>
    ) : (
      <div
        className='fixed top-0 inset-x-0 w-full z-[5] max-w-8xl flex 
        justify-between md:justify-end items-center gap-4 p-2 px-8 backdrop-blur-md'
      >
        <NavigationDropdown />
        <UserSessionNav />
      </div>
    ))
  );
};

export default Navbar;
