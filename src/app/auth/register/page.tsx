import Link from 'next/link';
import { FC } from 'react';
import { ChevronLeft } from 'lucide-react';
import { buttonVariants } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import Register from '@/components/auth/Register';

const Page: FC = () => {
  return (
    <div className='container'>
      <div className='max-w-2xl mx-auto h-fit pt-[100px] space-y-4'>
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

        <Register />
      </div>
    </div>
  );
};

export default Page;
