'use client';

import { FC } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Strategic } from '@prisma/client';
import { Card } from '@/components/ui/Card';
import { Heading } from '@/components/ui/Heading';
import { Separator } from '@/components/ui/Separator';
import { buttonVariants } from '@/components/ui/Button';
import { enumReplacer } from '@/util';
import { BarChart2, Briefcase, Edit, Trash2, Users2 } from 'lucide-react';
import { useAuthStore } from '@/store/auth-store';
import useAxiosPrivate from '@/hooks/use-axios-private';
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
import toast from 'react-hot-toast';

interface StrategicProps {
  data: Strategic[] | null;
  baseUrl: string;
}

const Strategic: FC<StrategicProps> = ({ data, baseUrl }) => {
  const axios = useAxiosPrivate();
  const role = useAuthStore((state) => state.session?.role);

  const deleteStrategic = async (id: string) => {
    try {
      await axios.delete(`/strategic/${id}`);
      toast.success('Strategic deleted successfully!');
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (err) {
      toast.error('Failed to delete strategic!');
    }
  };

  return (
    <div className='flex flex-col gap-2'>
      <div className='pb-4'>
        <div className='flex flex-col pt-16 lg:pt-0 lg:flex-row items-start lg:items-center justify-between'>
          <Heading
            title='Strategic'
            description='Startup detail information about Strategic.'
          />
          <div className='flex gap-4'>
            {role === 'ADMIN' && (
              <Link
                href={baseUrl + '/strategic/create'}
                className={cn(
                  buttonVariants({ size: 'sm' }),
                  'bg-tertiary hover:bg-tertiary hover:opacity-90'
                )}
              >
                Add new
              </Link>
            )}
          </div>
        </div>
        <Separator className='mt-4 lg:mt-0' />
      </div>
      {data && data.length > 0 ? (
        <Card className='p-4'>
          {data.map((item) => (
            <div key={item.id}>
              <div className='grid grid-flow-row py-2'>
                <div className='flex flex-row justify-start gap-2'>
                  {item.business_point === 'BUSINESS_MODEL' ? (
                    <Briefcase className='w-6 h-6' color='red' />
                  ) : item.business_point === 'PARTNERSHIP' ? (
                    <Users2 className='w-6 h-6' color='red' />
                  ) : item.business_point === 'TRACTION' ? (
                    <BarChart2 className='w-6 h-6' color='red' />
                  ) : null}
                  <span className='text-lg font-semibold'>
                    {enumReplacer(item.business_point)}
                  </span>
                  {role === 'ADMIN' && (
                    <div className='flex flex-row gap-2'>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <Link href={`${baseUrl}/strategic/${item.id}/edit`}>
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
                              Please be aware that this action is irreversible.
                              Once completed, the data will be permanently
                              erased and cannot be retrieved.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => deleteStrategic(item.id)}
                            >
                              Continue
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  )}
                </div>
                <p>{item.description}</p>
              </div>
            </div>
          ))}
        </Card>
      ) : (
        <p className='text-sm text-muted-foreground py-2'>
          No strategic data found.
        </p>
      )}
    </div>
  );
};

export default Strategic;
