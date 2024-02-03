'use client';

import { FC } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Service } from '@prisma/client';
import { BadgePercent, Edit, Trash2 } from 'lucide-react';
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

interface ServiceProps {
  data: Service[] | null;
  baseUrl: string;
}

const Service: FC<ServiceProps> = ({ data, baseUrl }) => {
  const axios = useAxiosPrivate();
  const role = useAuthStore((state) => state.session?.role);

  const deleteService = async (id: string) => {
    try {
      await axios.delete(`/service/${id}`);
      toast.success('Service deleted successfully!');
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (err) {
      toast.error('Failed to delete service!');
    }
  };

  return (
    <div className='flex flex-col gap-2'>
      <div className='pt-4'>
        <div className='flex flex-col pt-4 lg:pt-0 lg:flex-row items-start lg:items-center justify-between'>
          <Heading
            title='Service'
            description="Startup detail information about services they provides and it's revenue percentage."
          />
          <div className='flex gap-4'>
            {role === 'ADMIN' && (
              <Link
                href={baseUrl + '/service/create'}
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
        <div className='flex flex-col lg:flex-row gap-4 pt-4'>
          {data.map((item) => (
            <Card
              key={item.id}
              className='flex flex-row items-center justify-start text-sm gap-2 p-4'
            >
              <span className='font-bold'>{item.title}</span>
              <BadgePercent className='w-4 h-4' />
              {item.revenue_percentage} %
              {role === 'ADMIN' && (
                <div className='flex flex-row gap-2'>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Link href={`${baseUrl}/service/${item.id}/edit`}>
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
                          onClick={() => deleteService(item.id)}
                        >
                          Continue
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              )}
            </Card>
          ))}
        </div>
      ) : (
        <p className='text-sm text-muted-foreground py-2'>
          No service data found.
        </p>
      )}
    </div>
  );
};

export default Service;
