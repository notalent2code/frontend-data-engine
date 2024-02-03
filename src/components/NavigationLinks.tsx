'use client';

import Link from 'next/link';
import { BarChart2, Landmark, LucideIcon, Users, Wallet2 } from 'lucide-react';
import { Role } from '@prisma/client';
import { useAuthStore } from '@/store/auth-store';
import { Loader } from './ui/Loader';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

type NavigationLink = {
  name: string;
  path: string;
  icon: LucideIcon;
};

export const adminLinks: NavigationLink[] = [
  {
    name: 'Analytics',
    path: '/dashboard/analytics',
    icon: BarChart2,
  },
  {
    name: 'Portfolio',
    path: '/dashboard/startups',
    icon: Wallet2,
  },
  {
    name: 'Venture Capital',
    path: '/dashboard/venture-capital',
    icon: Landmark,
  },
  {
    name: 'User Management',
    path: '/dashboard/manage-users',
    icon: Users,
  },
];

export const investorLinks: NavigationLink[] = [
  {
    name: 'Portfolio',
    path: '/dashboard/startups',
    icon: Wallet2,
  },
  {
    name: 'Venture Capital',
    path: '/dashboard/venture-capital/profile',
    icon: Landmark,
  },
];

const NavigationLinks = () => {
  const pathname = usePathname();
  const [role, setRole] = useState<Role | undefined>(undefined);
  const userRole = useAuthStore((state) => state.session?.role);

  useEffect(() => {
    setRole(userRole);
  }, [userRole]);

  return role === Role.ADMIN ? (
    adminLinks.map((link) => (
      <Link href={link.path} key={link.name}>
        <button
          className={`w-full flex items-center space-x-2 bg-slate-800
          hover:bg-opacity-30 py-2 px-2 my-2 rounded-lg text-white ${
            pathname === link.path ? 'bg-opacity-30' : 'bg-opacity-10'
          }`}
        >
          <link.icon className='w-4 h-4' />
          <span className='text-sm font-semibold'>{link.name}</span>
        </button>
      </Link>
    ))
  ) : role === Role.INVESTOR ? (
    investorLinks.map((link) => (
      <Link href={link.path} key={link.name}>
        <button
          className={`w-full flex items-center space-x-2 bg-slate-800
          hover:bg-opacity-30 py-2 px-2 my-2 rounded-lg text-white ${
            pathname === link.path ? 'bg-opacity-30' : 'bg-opacity-10'
          }`}
        >
          <link.icon className='w-4 h-4' />
          <span className='text-sm font-semibold'>{link.name}</span>
        </button>
      </Link>
    ))
  ) : (
    <Loader />
  );
};

export default NavigationLinks;
