import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/Table';
import dayjs from 'dayjs';
import { FC } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/Card';
import { Loader } from '@/components/ui/Loader';
import { StartupToInvest } from '@prisma/client';
import { useQuery } from '@tanstack/react-query';
import { Heading } from '@/components/ui/Heading';
import { useAuthStore } from '@/store/auth-store';
import { Separator } from '@/components/ui/Separator';
import { buttonVariants } from '@/components/ui/Button';
import useAxiosPrivate from '@/hooks/use-axios-private';
import DropdownActions from '@/components/ui/DropdownActions';
import { enumReplacer } from '@/util';

interface StartupToInvestProps {
  investorId: string;
  addUrl: string;
  editUrl: string;
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

const StartupToInvest: FC<StartupToInvestProps> = ({
  addUrl,
  editUrl,
  investorId,
}) => {
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

  return isLoading ? (
    <Loader />
  ) : error ? (
    <p>Error: {error.message}</p>
  ) : data && data.length > 0 ? (
    <div>
      <div className='py-6'>
        <div className='flex flex-col pt-16 lg:pt-0 lg:flex-row items-start lg:items-center justify-between'>
          <Heading
            title='Startup to Invest'
            description='Detail information about investment between VC and Startup.'
          />
          {role === 'ADMIN' && (
            <Link
              href={addUrl + '/startup-to-invest'}
              className={cn(buttonVariants({ size: 'lg' }))}
            >
              Add new
            </Link>
          )}
        </div>
        <Separator className='mt-4 lg:mt-0' />
      </div>
      <div className=''>
        <Card>
          <div className='overflow-auto max-h-[500px]'>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className='p-5'>Startup</TableHead>
                  <TableHead>Progress</TableHead>
                  <TableHead>Detail</TableHead>
                  <TableHead>Date Updated</TableHead>
                  <TableHead>Actions</TableHead>
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
                    <TableCell>
                      <DropdownActions
                        editUrl={`${editUrl}/startup-to-invest/${item.id}`}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>
    </div>
  ) : (
    <p className='text-sm text-muted-foreground'>
      No startup to invest data found.
    </p>
  );
};

export default StartupToInvest;
