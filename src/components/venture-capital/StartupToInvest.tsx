import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/Tooltip';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/Table';
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
import dayjs from 'dayjs';
import { FC } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';
import { enumReplacer } from '@/util';
import { Edit, Trash2 } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Loader } from '@/components/ui/Loader';
import { StartupToInvest } from '@prisma/client';
import { Heading } from '@/components/ui/Heading';
import { useAuthStore } from '@/store/auth-store';
import { Separator } from '@/components/ui/Separator';
import { buttonVariants } from '@/components/ui/Button';
import useAxiosPrivate from '@/hooks/use-axios-private';
import { useQuery } from '@tanstack/react-query';

interface StartupToInvestProps {
  investorId: string;
  baseUrl: string;
}

type Startup = {
  name: string;
};

type Investor = {
  name: string;
};

type ExtendedStartupToInvest = StartupToInvest & {
  startup: Startup;
  investor: Investor;
};

const StartupToInvest: FC<StartupToInvestProps> = ({ baseUrl, investorId }) => {
  const axios = useAxiosPrivate();
  const role = useAuthStore((state) => state.session?.role);

  const fetchStartupToInvest = async () => {
    const { data } = await axios.get(
      `startup-to-invest/investor/${investorId}`
    );
    return data as ExtendedStartupToInvest[];
  };

  const { data, error, isLoading } = useQuery({
    queryKey: ['startup-to-invest', investorId],
    queryFn: fetchStartupToInvest,
  });

  const deleteStartupToInvest = async (id: string) => {
    try {
      await axios.delete(`startup-to-invest/${id}`);
      toast.success('Successfully deleted startup to invest!');
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error: any) {
      toast.error('Failed to delete startup to invest!');
    }
  };

  return isLoading ? (
    <Loader />
  ) : error ? (
    <p>Error: {error.message}</p>
  ) : (
    <div className='pb-16'>
      <div className='py-6'>
        <div className='flex flex-col lg:flex-row items-start lg:items-center justify-between'>
          <Heading
            title='Startup to Invest'
            description='Detail information about investment between VC and Startup.'
          />
          {role === 'ADMIN' && (
            <Link
              href={`${baseUrl}/startup-to-invest/create`}
              className={cn(buttonVariants({ size: 'lg' }))}
            >
              Add new
            </Link>
          )}
        </div>
        <Separator className='mt-4 lg:mt-0' />
      </div>
      {data && data.length > 0 ? (
        <Card>
          <div className='overflow-auto max-h-[500px]'>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className='p-5'>Startup</TableHead>
                  <TableHead>Progress</TableHead>
                  <TableHead>Detail</TableHead>
                  <TableHead>Date Updated</TableHead>
                  {role === 'ADMIN' && <TableHead>Action</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className='p-5'>{item.startup.name}</TableCell>
                    <TableCell>{enumReplacer(item.progress)}</TableCell>
                    <TableCell className='max-w-md'>{item.detail}</TableCell>
                    <TableCell>
                      {dayjs(item.updated_at).format('D MMMM YYYY')}
                    </TableCell>
                    {role === 'ADMIN' && (
                      <TableCell>
                        <div className='flex flex-row gap-2'>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <Link
                                  href={`${baseUrl}/startup-to-invest/${item.id}/edit`}
                                >
                                  <Edit className='h-6 w-6' />
                                </Link>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Edit data</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>

                          <AlertDialog>
                            <AlertDialogTrigger>
                              <Trash2 className='h-6 w-6' />
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Are you absolutely sure?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  Please be aware that this action is
                                  irreversible. Once completed, the data will be
                                  permanently erased and cannot be retrieved.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => deleteStartupToInvest(item.id)}
                                >
                                  Continue
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      ) : (
        <p className='text-sm text-muted-foreground py-2'>
          No startup to invest data found.
        </p>
      )}
    </div>
  );
};

export default StartupToInvest;
