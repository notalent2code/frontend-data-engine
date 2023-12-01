'use client';

import StartupForm from '@/components/startup/forms/StartupForm';
import { Loader } from '@/components/ui/Loader';
import useAxiosPrivate from '@/hooks/use-axios-private';
import { StartupDetail } from '@/types';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';

const Page = () => {
  const axios = useAxiosPrivate();
  const { id } = useParams();

  const fetchStartup = async () => {
    const { data } = await axios.get<StartupDetail>(`/startups/${id}`);
    return data;
  };

  const { data, isFetching } = useQuery({
    queryKey: ['startup', id],
    queryFn: fetchStartup,
  });

  return isFetching ? (
    <Loader />
  ) : (
    <StartupForm variant='edit' initialData={data} />
  );
};

export default Page;
