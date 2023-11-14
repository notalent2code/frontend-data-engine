import Link from 'next/link';
import { BarChart2, Landmark, LucideIcon, Users, Wallet2 } from 'lucide-react';

type NavigationLink = {
  name: string;
  path: string;
  icon: LucideIcon;
};

export const links: NavigationLink[] = [
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

const NavigationLinks = () => {
  return links.map((link) => (
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
