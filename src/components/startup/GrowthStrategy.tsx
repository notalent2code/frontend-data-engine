'use client';

import { FC } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { GrowthStrategy } from '@prisma/client';
import { Card } from '@/components/ui/Card';
import { Heading } from '@/components/ui/Heading';
import { Separator } from '@/components/ui/Separator';
import { buttonVariants } from '@/components/ui/Button';
import useAxiosPrivate from '@/hooks/use-axios-private';
import { useAuthStore } from '@/store/auth-store';
import toast from 'react-hot-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/AlertDialog';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/Tooltip';
import { Edit, Trash2 } from 'lucide-react';

interface GrowthStrategyProps {
  data: GrowthStrategy[] | null;
  baseUrl: string;
}

const GrowthStrategy: FC<GrowthStrategyProps> = ({ data, baseUrl }) => {
  const axios = useAxiosPrivate();
  const role = useAuthStore((state) => state.session?.role);

  const deleteGrowthStrategy = async (id: string) => {
    try {
      await axios.delete(`/growth-strategy/${id}`);
      toast.success('Growth strategy deleted successfully!');
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (err) {
      toast.error('Failed to delete growth strategy!');
    }
  };

  return (
    <div className='flex flex-col gap-2'>
      <div className='pb-4'>
        <div className='flex flex-col pt-8 lg:pt-0 lg:flex-row items-start lg:items-center justify-between'>
          <Heading
            title='Growth Strategy'
            description='Startup detail information about growth strategy.'
          />
          {role === 'ADMIN' && (
            <Link
              href={baseUrl + '/growth-strategy/create'}
              className={cn(
                buttonVariants({ size: 'sm' }),
                'bg-tertiary hover:bg-tertiary hover:opacity-90'
              )}
            >
              Add new
            </Link>
          )}
        </div>
        <Separator className='mt-4 lg:mt-0' />
      </div>
      {data && data.length > 0 ? (
        <div className='flex flex-col lg:flex-row gap-4'>
          {data.map((item) => (
            <Card key={item.id} className='flex flex-col gap-2 p-4'>
              {role === 'ADMIN' && (
                <div className='flex flex-row gap-2'>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Link
                          href={`${baseUrl}/growth-strategy/${item.id}/edit`}
                        >
                          <Edit className='h-4 w-4' />
                        </Link>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Edit data</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <AlertDialog>
                    <AlertDialogTrigger>
                      <Trash2 className='h-4 w-4' />
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Are you absolutely sure?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          Please be aware that this action is irreversible. Once
                          completed, the data will be permanently erased and
                          cannot be retrieved.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => deleteGrowthStrategy(item.id)}
                        >
                          Continue
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              )}
              <p>{item.description}</p>
            </Card>
          ))}
        </div>
      ) : (
        <p className='text-sm text-muted-foreground'>
          No growth strategy data found.
        </p>
      )}
    </div>
  );
};

export default GrowthStrategy;
