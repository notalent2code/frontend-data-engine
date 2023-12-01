'use client';

import { Synergy } from '@prisma/client';
import { useParams } from 'next/navigation';
import { Loader } from '@/components/ui/Loader';
import { useQuery } from '@tanstack/react-query';
import useAxiosPrivate from '@/hooks/use-axios-private';
import SynergyForm from '@/components/startup/forms/SynergyForm';

const Page = () => {
  const axios = useAxiosPrivate();
  const { synergy_id: synergyId } = useParams();

  const fetchSynergy = async () => {
    const { data } = await axios.get<Synergy>(`/synergy/${synergyId}`);
    return data;
  };

  const { data, isFetching } = useQuery({
    queryKey: ['synergy', synergyId],
    queryFn: fetchSynergy,
  });

  return isFetching ? (
    <Loader />
  ) : (
    <SynergyForm variant='edit' initialData={data} />
  );
};

export default Page;
