'use client';

import { GrowthStrategy } from '@prisma/client';
import { useParams } from 'next/navigation';
import { Loader } from '@/components/ui/Loader';
import { useQuery } from '@tanstack/react-query';
import useAxiosPrivate from '@/hooks/use-axios-private';
import GrowthStrategyForm from '@/components/startup/forms/GrowthStrategyForm';

const Page = () => {
  const axios = useAxiosPrivate();
  const { gs_id: growthstrategyId } = useParams();

  const fetchGrowthStrategy = async () => {
    const { data } = await axios.get<GrowthStrategy>(`/growth-strategy/${growthstrategyId}`);
    return data;
  };

  const { data, isFetching } = useQuery({
    queryKey: ['growthstrategy', growthstrategyId],
    queryFn: fetchGrowthStrategy,
  });

  return isFetching ? (
    <Loader />
  ) : (
    <GrowthStrategyForm variant='edit' initialData={data} />
  );
};

export default Page;
