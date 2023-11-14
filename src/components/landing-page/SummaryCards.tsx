'use client';

import {
  CircleDollarSign,
  DollarSign,
  GraduationCap,
  SigmaIcon,
} from 'lucide-react';
import SmallCard from '../SmallCard';
import useAxiosPrivate from '@/hooks/use-axios-private';
import { useQuery } from '@tanstack/react-query';
import { StartupSummary } from '@/types';

const SummaryCards = () => {
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

  function formatToIndonesianRupiah(number: any) {
    let scale = '';
    let scaledNumber = number;
    if (number >= 1e12) {
      scale = 'Triliun';
      scaledNumber = number / 1e12;
    } else if (number >= 1e9) {
      scale = 'Miliar';
      scaledNumber = number / 1e9;
    } else if (number >= 1e6) {
      scale = 'Juta';
      scaledNumber = number / 1e6;
    }

    scaledNumber = Math.round(scaledNumber);

    return scaledNumber + ' ' + scale;
  }

  return isLoading ? (
    <p>Loading...</p>
  ) : (
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
        content={formatToIndonesianRupiah(data?.total_revenue)}
      />
      <SmallCard
        key={4}
        Icon={CircleDollarSign}
        color='bg-primary text-white'
        title={'Total Pendanaan'}
        content={formatToIndonesianRupiah(data?.total_funding)}
      />
    </>
  );
};

export default SummaryCards;
