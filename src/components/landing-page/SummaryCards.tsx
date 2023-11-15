'use client';

import {
  ChevronsUp,
  CircleDollarSign,
  DollarSign,
  Egg,
  Gamepad2,
  GraduationCap,
  ShieldCheck,
  SigmaIcon,
  Users2,
} from 'lucide-react';
import SmallCard from '../SmallCard';
import useAxiosPrivate from '@/hooks/use-axios-private';
import { useQuery } from '@tanstack/react-query';
import { StartupSummary } from '@/types';
import { Loader } from '@/components/ui/Loader';
import { FC } from 'react';
import { formatToIndonesianRupiah } from '@/util';

interface SummaryCardsProps {
  type: 'home' | 'dashboard';
}

const SummaryCards: FC<SummaryCardsProps> = ({ type }) => {
  const axios = useAxiosPrivate();

  const fetchSummary = async () => {
    const { data } = await axios.get('dashboard/summary');
    return data as StartupSummary;
  };

  const { data, isLoading } = useQuery({
    queryKey: ['summary'],
    queryFn: fetchSummary,
    staleTime: 1000 * 60 * 60 * 24,
  });

  return isLoading ? (
    <Loader />
  ) : type === 'home' ? (
    <>
      <SmallCard
        key={1}
        Icon={SigmaIcon}
        color='bg-primary text-white'
        title={'Total Startup'}
        content={data?.count.toString()}
      />
      <SmallCard
        key={2}
        Icon={GraduationCap}
        color='bg-primary text-white'
        title={'Startup Alumni'}
        content={data?.alumni.toString()}
      />
      <SmallCard
        key={3}
        Icon={DollarSign}
        color='bg-primary text-white'
        title={'Total Revenue'}
        content={formatToIndonesianRupiah(data?.total_revenue, 'full')}
      />
      <SmallCard
        key={4}
        Icon={CircleDollarSign}
        color='bg-primary text-white'
        title={'Total Pendanaan'}
        content={formatToIndonesianRupiah(data?.total_funding, 'full')}
      />
    </>
  ) : (
    <section className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
      <SmallCard
        key={1}
        Icon={SigmaIcon}
        color='bg-primary text-white'
        title={'Total Startup'}
        content={data?.count.toString()}
      />
      <SmallCard
        key={2}
        Icon={Egg}
        color='bg-tertiary text-white'
        title={'Startup Inkubasi'}
        content={data?.incubation.toString()}
      />
      <SmallCard
        key={3}
        Icon={ChevronsUp}
        color='bg-[#F97B22] text-white'
        title={'Startup Akselerasi'}
        content={data?.acceleration.toString()}
      />
      <SmallCard
        key={4}
        Icon={GraduationCap}
        color='bg-[#78C1F3] text-white'
        title={'Startup Alumni'}
        content={data?.alumni.toString()}
      />
      <SmallCard
        key={5}
        Icon={Gamepad2}
        color='bg-[#B08BBB] text-white'
        title={'Startup Games'}
        content={data?.games.toString()}
      />
      <SmallCard
        key={6}
        Icon={CircleDollarSign}
        color='bg-[#F9B572] text-white'
        title={'Startup Fund of Funds'}
        content={data?.fund_of_funds.toString()}
      />
      <SmallCard
        key={7}
        Icon={Users2}
        color='bg-[#618264] text-white'
        title={'Startup Partnership'}
        content={data?.partnership.toString()}
      />
      <SmallCard
        key={8}
        Icon={ShieldCheck}
        color='bg-[#FF7878] text-white'
        title={'Startup Aktif'}
        content={data?.active.toString()}
      />
    </section>
  );
};

export default SummaryCards;
