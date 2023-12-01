'use client';

import PerformanceForm from '@/components/startup/forms/PerformanceForm';
import { Loader } from '@/components/ui/Loader';
import useAxiosPrivate from '@/hooks/use-axios-private';
import { Performance } from '@prisma/client';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';

const Page = () => {
  const axios = useAxiosPrivate();
  const { perf_id: performanceId } = useParams();

  const fetchPerformance = async () => {
    const { data } = await axios.get<Performance>(
      `/performance/${performanceId}`
    );
    return data;
  };

  const { data, isFetching } = useQuery({
    queryKey: ['performance', performanceId],
    queryFn: fetchPerformance,
  });

  return isFetching ? (
    <Loader />
  ) : (
    <PerformanceForm variant='edit' initialData={data} />
  );
};

export default Page;
