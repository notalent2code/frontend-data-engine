'use client';

import useAxiosPrivate from '@/hooks/use-axios-private';
import { useQuery } from '@tanstack/react-query';
import { Loader } from '@/components/ui/Loader';
import SmallCard from '@/components/SmallCard';
import { CircleDollarSign } from 'lucide-react';
import { formatCurrencyValue } from '@/util';

type TotalYearlyRevenue = {
  year: number;
  total_revenue: string;
};

const TotalYearlyRevenue = () => {
  const axios = useAxiosPrivate();

  const fetchTotalYearlyRevenue = async () => {
    const { data } = await axios.get('/dashboard/total-yearly-revenue');
    return data as TotalYearlyRevenue[];
  };

  const { data, isLoading } = useQuery({
    queryKey: ['total-yearly-revenue'],
    queryFn: fetchTotalYearlyRevenue,
  });

  return isLoading ? (
    <Loader />
  ) : (
    data && (
      <section className='grid grid-cols-1 md:grid-cols-3 gap-4'>
        {data?.map((item) => (
          <SmallCard
            key={item.year}
            Icon={CircleDollarSign}
            color='bg-primary text-white'
            title={`Total Revenue ${item.year}`}
            content={`Rp ${formatCurrencyValue(parseInt(item.total_revenue))}`}
          />
        ))}
      </section>
    )
  );
};

export default TotalYearlyRevenue;
