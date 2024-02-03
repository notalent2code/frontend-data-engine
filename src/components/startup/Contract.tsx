'use client';

import {
  BadgePercent,
  CalendarDays,
  CircleDollarSign,
  PieChart,
} from 'lucide-react';
import { FC } from 'react';
import Link from 'next/link';
import dayjs from 'dayjs';
import { cn } from '@/lib/utils';
import { enumReplacer, formatCurrencyValue } from '@/util';
import { Contract } from '@prisma/client';
import { Heading } from '@/components/ui/Heading';
import { Separator } from '@/components/ui/Separator';
import { buttonVariants } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
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
import useAxiosPrivate from '@/hooks/use-axios-private';
import toast from 'react-hot-toast';

interface ContractProps {
  data: Contract | null;
  baseUrl: string;
}

const Contract: FC<ContractProps> = ({ data, baseUrl }) => {
  const axios = useAxiosPrivate();
  const role = useAuthStore((state) => state.session?.role);

  const deleteContract = async (id: string) => {
    try {
      await axios.delete(`/contract/${id}`);
      toast.success('Contract deleted successfully!');
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error: any) {
      toast.error('Something went wrong!');
    }
  };

  return (
    <>
      <div className='flex flex-col gap-2'>
        <div className='flex flex-col pt-16 lg:pt-0 lg:flex-row items-start lg:items-center justify-between'>
          <Heading
            title='Contract'
            description='Signed contract information.'
          />
          {role === 'ADMIN' && (
            <div className='flex flex-row gap-2'>
              <Link
                href={
                  data
                    ? `${baseUrl}/contract/${data.id}/edit`
                    : `${baseUrl}/contract/create`
                }
                className={cn(
                  buttonVariants({ size: 'sm' }),
                  'bg-tertiary hover:bg-tertiary hover:opacity-90'
                )}
              >
                {data ? 'Edit' : 'Add new'}
              </Link>
              {data && (
                <div className={buttonVariants({ size: 'sm' })}>
                  <AlertDialog>
                    <AlertDialogTrigger>Delete</AlertDialogTrigger>
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
                          onClick={() => deleteContract(data.id)}
                        >
                          Continue
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              )}
            </div>
          )}
        </div>
        <Separator className='mt-4 lg:mt-0' />
      </div>
      {data ? (
        <Card className='my-4 max-w-[360px] md:max-w-6xl'>
          <CardHeader>
            <Card className='py-6 px-4 w-fit'>
              <CardTitle>PKS Number: <br /> {data.pks_number}</CardTitle>
            </Card>
          </CardHeader>
          <CardContent className='flex flex-col gap-2'>
            <div className='flex flex-col lg:flex-row items-start justify-start gap-4'>
              <Card className='flex flex-row items-center justify-start text-sm gap-2 p-4'>
                <span className='font-bold'>Signed PKS Date:</span>
                <CalendarDays className='w-4 h-4' />
                {dayjs(data.signed_pks_date).format('D MMMM YYYY')}
              </Card>
              <Card className='flex flex-row items-center justify-start text-sm gap-2 p-4'>
                <span className='font-bold'>Closing BAK Date:</span>
                <CalendarDays className='w-4 h-4' />
                {dayjs(data.closing_bak_date).format('D MMMM YYYY')}
              </Card>
              <Card className='flex flex-row items-center justify-start text-sm gap-2 p-4'>
                <span className='font-bold'>Total Funding (IDR):</span>
                <CircleDollarSign className='w-4 h-4' />
                {formatCurrencyValue(parseInt(data.total_funding.toString()))}
              </Card>
            </div>
            <h1 className='text-lg font-bold'>Convertible Note</h1>
            <div className='flex flex-col lg:flex-row items-start justify-start gap-4'>
              <Card className='flex flex-row items-center justify-start text-sm gap-2 p-4'>
                <span className='font-bold'>CN Percentage:</span>
                <BadgePercent className='w-4 h-4' />
                <p>
                  {(parseFloat(data.convertible_note.toString()) * 100).toFixed(
                    2
                  )}{' '}
                  %
                </p>
              </Card>
              <Card className='flex flex-row items-center justify-start text-sm gap-2 p-4'>
                <span className='font-bold'>CN Year:</span>
                <CalendarDays className='w-4 h-4' />
                {data.convertible_note_year}
              </Card>
              <Card className='flex flex-row items-center justify-start text-sm gap-2 p-4'>
                <span className='font-bold'>CN Age:</span>
                <CalendarDays className='w-4 h-4' />
                {data.convertible_note_months} months
              </Card>
              <Card className='flex flex-row items-center justify-start text-sm gap-2 p-4'>
                <span className='font-bold'>CN Status:</span>
                <PieChart className='w-4 h-4' />
                {enumReplacer(data.convertible_note_status)}
              </Card>
            </div>
          </CardContent>
        </Card>
      ) : (
        <p className='text-sm text-muted-foreground py-2'>
          No contract information found.
        </p>
      )}
    </>
  );
};

export default Contract;
