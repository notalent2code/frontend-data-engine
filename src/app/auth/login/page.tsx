import Link from 'next/link';
import { FC } from 'react';
import { ChevronLeft } from 'lucide-react';
import { buttonVariants } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import Login from '@/components/auth/Login';

const Page: FC = () => {
  return (
    <div className='absolute inset-0'>
      <div className='h-full max-w-2xl mx-auto mt-10 flex flex-col items-center justify-center gap-5'>
        <Link
          href='/'
          className={cn(
            buttonVariants({ variant: 'ghost' }),
            'self-start -mt-20'
          )}
        >
          <ChevronLeft className='mr-2 h-4 w-4' />
          Home
        </Link>

        <Login />
      </div>
    </div>
  );
};

export default Page;
