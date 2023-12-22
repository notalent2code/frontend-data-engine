'use client';

import Link from 'next/link';
import { Avatar } from '@radix-ui/react-avatar';
import { Icons } from '@/components/Icons';
import { useAuthStore } from '@/store/auth-store';
import { buttonVariants } from '@/components/ui/Button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/DropdownMenu';
import { useRouter } from 'next/navigation';
import { Home, LayoutDashboard, LogOut, Trophy, User2 } from 'lucide-react';
import toast from 'react-hot-toast';
import useAxiosPrivate from '@/hooks/use-axios-private';

export function UserSessionNav() {
  const router = useRouter();
  const authStore = useAuthStore();
  const axios = useAxiosPrivate();
  const user = authStore.session;

  const logout = async () => {
    try {
      authStore.deleteSession();
      authStore.deleteToken();
      document.cookie =
        'isLoggedIn=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax;';

      router.push('/auth/login');
      const { data } = await axios.delete('/auth/logout');

      toast.success(data.message);
    } catch (error: any) {
      toast.error(error.response.data.message);
    }
  };

  return user ? (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar>
          <div className='flex flex-row justify-between items-center gap-2'>
            <span className='font-semibold text-sm'>
              {`${user.first_name} ${user.last_name}`}
            </span>
            <Icons.user className='w-8 h-8 text-primary' />
          </div>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        <div className='flex flex-col items-center justify-start gap-2 p-2'>
          <div className='space-y-1 leading-none'>
            <p className='font-medium'>{`${user.first_name} (${user.role})`}</p>
            <p className='truncate text-sm text-primary'>{user.email}</p>
          </div>
        </div>

        <DropdownMenuSeparator />

        <Link href='/'>
          <DropdownMenuItem className='cursor-pointer'>
            <Home className='mr-2 h-4 w-4' />
            Home
          </DropdownMenuItem>
        </Link>

        <Link href='/dashboard/profile'>
          <DropdownMenuItem className='cursor-pointer'>
            <User2 className='mr-2 h-4 w-4' />
            Profile
          </DropdownMenuItem>
        </Link>

        {user.role === 'ADMIN' && (
          <Link href='/dashboard'>
            <DropdownMenuItem className='cursor-pointer'>
              <LayoutDashboard className='mr-2 h-4 w-4' />
              Dashboard
            </DropdownMenuItem>
          </Link>
        )}

        <Link href='/dashboard/startups'>
          <DropdownMenuItem className='cursor-pointer'>
            <Trophy className='mr-2 h-4 w-4' />
            Portfolio
          </DropdownMenuItem>
        </Link>

        <DropdownMenuSeparator />

        <DropdownMenuItem className='cursor-pointer' onSelect={() => logout()}>
          <LogOut className='mr-2 h-4 w-4' />
          <p>Log Out</p>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ) : (
    <>
      <Link href='/startups' className='text-md font-bold text-primary'>
        Portfolio
      </Link>
      <Link href='/auth/login' className={buttonVariants()}>
        Log In
      </Link>
    </>
  );
}
