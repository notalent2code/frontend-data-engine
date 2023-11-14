import { Icons } from '@/components/Icons';
import { BarChart2, Landmark, Users, Wallet2 } from 'lucide-react';
import Link from 'next/link';

const Sidebar = () => {
  return (
    <aside className='sticky top-0 z-10 h-screen w-56 p-4 main-bg'>
      <div className='flex items-center mb-4 space-x-1 pl-2'>
        <Link href='/dashboard/analytics'>
          <Icons.whiteLogo />
        </Link>
      </div>
      <nav className='space-y-2'>
        <Link href='/dashboard/analytics'>
          <button className='w-full flex items-center space-x-2 bg-slate-800 bg-opacity-10 hover:bg-opacity-30 active:bg-opacity-30 py-2 px-2 my-2 rounded-lg text-white'>
            <BarChart2 className='w-4 h-4' />
            <span className='text-sm font-semibold'>Analytics</span>
          </button>
        </Link>
        <Link href='/dashboard/startups'>
          <button className='w-full flex items-center space-x-2 bg-slate-800 bg-opacity-10 hover:bg-opacity-30 active:bg-opacity-30 py-2 px-2 my-2 rounded-lg text-white'>
            <Wallet2 className='w-4 h-4' />
            <span className='text-sm font-semibold'>Portfolio</span>
          </button>
        </Link>
        <Link href='/dashboard/venture-capital'>
          <button className='w-full flex items-center space-x-2 bg-slate-800 bg-opacity-10 hover:bg-opacity-30 active:bg-opacity-30 py-2 px-2 my-2 rounded-lg text-white'>
            <Landmark className='w-4 h-4' />
            <span className='text-sm font-semibold'>Venture Capital</span>
          </button>
        </Link>
        <Link href='manage-users'>
          <button className='w-full flex items-center space-x-2 bg-slate-800 bg-opacity-10 hover:bg-opacity-30 active:bg-opacity-30 py-2 px-2 my-2 rounded-lg text-white'>
            <Users className='w-4 h-4' />
            <span className='text-sm font-semibold'>Manage Users</span>
          </button>
        </Link>
      </nav>
    </aside>
  );
};

export default Sidebar;
