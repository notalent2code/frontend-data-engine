'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/Badge';
import { Loader } from '@/components/ui/Loader';
import { Investor, Role } from '@prisma/client';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/store/auth-store';
import { useParams, useRouter } from 'next/navigation';
import { buttonVariants } from '@/components/ui/Button';
import useAxiosPrivate from '@/hooks/use-axios-private';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { CircleDollarSign, Cookie, Goal, Newspaper, Tag } from 'lucide-react';
import { enumReplacer, formatCurrencyValue, parseInvestorArray } from '@/util';
import StartupToInvest from '@/components/venture-capital/StartupToInvest';
import DeleteAlertDialog from '@/components/DeleteAlertDialog';
import toast from 'react-hot-toast';

const Page = () => {
  const axios = useAxiosPrivate();
  const router = useRouter();
  const { id: investorId } = useParams();
  const role = useAuthStore((state) => state.session?.role);

  const baseUrl = `/dashboard/venture-capital/${investorId}`;

  const deleteVentureCapital = async () => {
    try {
      await axios.delete(`investor/${investorId}`);
      toast.success('Successfully deleted venture capital!');
      router.push('/dashboard/venture-capital');
    } catch (error: any) {
      toast.error('Failed to delete venture capital!');
    }
  };

  const fetchVentureCapitalDetail = async () => {
    let url = '';
    switch (role) {
      case Role.ADMIN:
        url = `investor/${investorId}`;
        break;
      case Role.INVESTOR:
        url = 'investor/user/profile';
        break;
      default:
        throw new Error('Invalid role');
    }

    const { data } = await axios.get(url);
    return data as Investor;
  };

  const { data, error, isLoading } = useQuery({
    queryKey: ['investor', investorId],
    queryFn: fetchVentureCapitalDetail,
  });

  return isLoading ? (
    <Loader />
  ) : error ? (
    <div>Error: {error.message}</div>
  ) : data ? (
    <div className='grid grid-flow-row gap-8'>
      <Card>
        <CardHeader className='flex flex-row items-center justify-between px-4'>
          <div>
            <CardTitle className='text-2xl font-bold'>{data.name}</CardTitle>
            <div className='flex flex-row gap-2 pt-2'>
              <Badge className='text-xs bg-primary'>
                {enumReplacer(data.instrument_type)}
              </Badge>
              <Badge className='text-xs bg-violet-800 hover:bg-violet-800 hover:opacity-90'>
                {enumReplacer(data.investment_syndication)}
              </Badge>
              <Badge className='text-xs bg-blue-800 hover:bg-blue-800 hover:opacity-90 '>
                {enumReplacer(data.investor_classification)}
              </Badge>
            </div>
          </div>
          {data && role === 'ADMIN' ? (
            <div className='flex flex-row gap-2'>
              <Link
                href={baseUrl + '/edit'}
                className={cn(
                  buttonVariants({ size: 'lg' }),
                  'bg-tertiary hover:bg-tertiary hover:opacity-90'
                )}
              >
                Edit
              </Link>
              <div className={buttonVariants({ size: 'lg' })}>
                <DeleteAlertDialog deleteFn={deleteVentureCapital} />
              </div>
            </div>
          ) : null}
        </CardHeader>
      </Card>

      <Card className='flex flex-col gap-4 p-4'>
        <div className='grid grid-cols-2 gap-4'>
          <Card className='flex flex-col items-start justify-start text-sm gap-2 p-4'>
            <div className='flex flex-row gap-2 items-center'>
              <Goal className='w-4 h-4' />
              <h1 className='text-lg font-bold'>Focused Sectors</h1>
            </div>
            <div className='flex flex-col gap-2'>
              {parseInvestorArray(data.focused_sectors).map((sector) => (
                <Badge key={sector} className='w-fit'>
                  {sector}
                </Badge>
              ))}
            </div>
          </Card>
          <Card className='flex flex-col items-start justify-start text-sm gap-2 p-4'>
            <div className='flex flex-row gap-2 items-center'>
              <Newspaper className='w-4 h-4' />
              <h1 className='text-lg font-bold'>Investment Stage</h1>
            </div>
            <div className='flex flex-col gap-2'>
              {parseInvestorArray(data.investment_stage).map((stage) => (
                <Badge key={stage} className='w-fit'>
                  {enumReplacer(stage)}
                </Badge>
              ))}
            </div>
          </Card>
        </div>
        <Card className='flex flex-row h-full items-center justify-start text-sm gap-2 p-4'>
          <CircleDollarSign className='w-4 h-4' />
          <span className='font-bold'>Ticket Size (USD)</span>
          {formatCurrencyValue(
            parseInt(data.ticket_size_min.toString())
          )} - {formatCurrencyValue(parseInt(data.ticket_size_max.toString()))}
        </Card>
        {data.appetites && data.appetites !== '-' ? (
          <Card className='flex flex-col items-start justify-start text-sm gap-2 p-4'>
            <div className='flex flex-row gap-2 items-center'>
              <Cookie className='w-4 h-4' />
              <h1 className='text-lg font-bold'>Appetites</h1>
            </div>
            {data.appetites}
          </Card>
        ) : null}
        {data.remarks && data.remarks !== '-' ? (
          <Card className='flex flex-col items-start justify-start text-sm gap-2 p-4'>
            <div className='flex flex-row gap-2 items-center'>
              <Tag className='w-4 h-4' />
              <h1 className='text-lg font-bold'>Remarks</h1>
            </div>
            {data.remarks}
          </Card>
        ) : null}
      </Card>

      <StartupToInvest investorId={data.id} baseUrl={baseUrl} />
    </div>
  ) : (
    <p className='text-sm text-muted-foreground py-2'>
      No venture capital data found.
    </p>
  );
};

export default Page;
