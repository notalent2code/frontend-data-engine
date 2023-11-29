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

interface ContractProps {
  data: Contract | null;
  addUrl: string;
  editUrl: string;
}

const Contract: FC<ContractProps> = ({ data, addUrl, editUrl }) => {
  return (
    <>
      <div>
        <div className='flex flex-col pt-16 lg:pt-0 lg:flex-row items-start lg:items-center justify-between'>
          <Heading
            title='Contract'
            description='Signed contract information.'
          />
          {data ? (
            <Link
              href={editUrl + `/contract/${data.id}`}
              className={cn(
                buttonVariants({ size: 'lg' }),
                'bg-tertiary hover:bg-tertiary hover:opacity-90'
              )}
            >
              Edit
            </Link>
          ) : (
            <Link
              href={addUrl + '/contract'}
              className={cn(buttonVariants({ size: 'lg' }))}
            >
              Add new
            </Link>
          )}
        </div>
        <Separator className='mt-4 lg:mt-0' />
      </div>
      {data ? (
        <Card>
          <CardHeader>
            <Card className='py-6 px-4 w-fit'>
              <CardTitle>PKS Number: {data.pks_number}</CardTitle>
            </Card>
          </CardHeader>
          <CardContent className='flex flex-col gap-2'>
            <div className='flex flex-row items-start justify-start gap-4'>
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
                <span className='font-bold'>Total Funding:</span>
                <CircleDollarSign className='w-4 h-4' />
                {formatCurrencyValue(parseInt(data.total_funding.toString()))}
              </Card>
            </div>
            <h1 className='text-lg font-bold'>Convertible Note</h1>
            <div className='flex flex-row items-start justify-start gap-4'>
              <Card className='flex flex-row items-center justify-start text-sm gap-2 p-4'>
                <span className='font-bold'>CN Percentage:</span>
                <BadgePercent className='w-4 h-4' />
                <p>{parseFloat(data.convertible_note.toString()) * 100} %</p>
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
        <p className='text-sm text-muted-foreground py-2'>No contract information found.</p>
      )}
    </>
  );
};

export default Contract;
