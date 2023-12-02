'use client';

import { FC } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { ProblemSolutionFit } from '@prisma/client';
import { Card } from '@/components/ui/Card';
import { Heading } from '@/components/ui/Heading';
import { Separator } from '@/components/ui/Separator';
import { buttonVariants } from '@/components/ui/Button';
import useAxiosPrivate from '@/hooks/use-axios-private';
import { useAuthStore } from '@/store/auth-store';
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
import toast from 'react-hot-toast';

interface ProblemSolutionFitProps {
  data: ProblemSolutionFit[] | null;
  baseUrl: string;
}

const ProblemSolutionFit: FC<ProblemSolutionFitProps> = ({ data, baseUrl }) => {
  const axios = useAxiosPrivate();
  const role = useAuthStore((state) => state.session?.role);

  const deletePsf = async (id: string) => {
    try {
      await axios.delete(`/psf/${id}`);
      toast.success('Problem solution fit deleted successfully!');
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (err) {
      toast.error('Failed to delete problem solution fit!');
    }
  };

  return (
    <div className='flex flex-col gap-2'>
      <div className='py-4'>
        <div className='flex flex-col pt-16 lg:pt-0 lg:flex-row items-start lg:items-center justify-between'>
          <Heading
            title='Problem Solution Fit'
            description="Startup detail information about service's problem solution fit."
          />
          {role === 'ADMIN' && (
            <Link
              href={baseUrl + '/psf/create'}
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
        <div className='flex flex-row gap-4'>
          {data.map((item) => (
            <div
              key={item.id}
              className='flex flex-row items-start justify-start gap-4'
            >
              <Card className='flex flex-col items-start justify-start gap-2 text-sm p-4'>
                <div className='flex flex-row gap-2'>
                  <span className='font-bold'>{item.title}</span>
                  {role === 'ADMIN' && (
                    <div className='flex flex-row gap-2'>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <Link href={`${baseUrl}/psf/${item.id}/edit`}>
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
                              onClick={() => deletePsf(item.id)}
                            >
                              Continue
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  )}
                </div>
                <Separator />
                <p>{item.description}</p>
              </Card>
            </div>
          ))}
        </div>
      ) : (
        <p className='text-sm text-muted-foreground'>
          No problem solution fit data found.
        </p>
      )}
    </div>
  );
};

export default ProblemSolutionFit;
