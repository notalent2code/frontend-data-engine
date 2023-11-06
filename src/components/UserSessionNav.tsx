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

export function UserSessionNav() {
  const router = useRouter();
  const authStore = useAuthStore();
  const user = authStore.session;

  const logout = () => {
    authStore.deleteSession();
    router.push('/auth/login');
    router.refresh();
  };

  return user ? (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar>
          <span className='sr-only'>{user.first_name}</span>
          <Icons.user className='w-8 h-8 text-muted-foreground' />
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='bg-white' align='end'>
        <div className='flex items-center justify-start gap-2 p-2'>
          <div className='flex flex-col space-y-1 leading-none'>
            <p className='font-medium'>{`${user.first_name} (${user.role})`}</p>
            <p className='w-[200px] truncate text-sm text-muted-foreground'>
              {user.email}
            </p>
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild className='cursor-pointer'>
          <Link href='/'>Home</Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild className='cursor-pointer'>
          <Link href='/dashboard'>Dashboard</Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild className='cursor-pointer'>
          <Link href='/portfolio'>Portfolio</Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className='cursor-pointer' onSelect={() => logout()}>
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ) : (
    <Link href='/auth/login' className={buttonVariants()}>
      Log In
    </Link>
  );
}
