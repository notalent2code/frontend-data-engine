'use client';

import Link from 'next/link';
import { BarChart2, Landmark, LucideIcon, Users, Wallet2 } from 'lucide-react';
import { Role } from '@prisma/client';
import { useAuthStore } from '@/store/auth-store';

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
    name: 'Manage Users',
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
    path: '/dashboard/venture-capital',
    icon: Landmark,
  },
];

const NavigationLinks = () => {
  const role = useAuthStore((state) => state.session?.role);

  return role === Role.ADMIN
    ? adminLinks.map((link) => (
        <Link href={link.path} key={link.name}>
          <button
            className='w-full flex items-center space-x-2 bg-slate-800 bg-opacity-10 
          hover:bg-opacity-30 active:bg-opacity-30 py-2 px-2 my-2 rounded-lg text-white'
          >
            <link.icon className='w-4 h-4' />
            <span className='text-sm font-semibold'>{link.name}</span>
          </button>
        </Link>
      ))
    : investorLinks.map((link) => (
        <Link href={link.path} key={link.name}>
          <button
            className='w-full flex items-center space-x-2 bg-slate-800 bg-opacity-10 
          hover:bg-opacity-30 active:bg-opacity-30 py-2 px-2 my-2 rounded-lg text-white'
          >
            <link.icon className='w-4 h-4' />
            <span className='text-sm font-semibold'>{link.name}</span>
          </button>
        </Link>
      ));
};

export default NavigationLinks;
