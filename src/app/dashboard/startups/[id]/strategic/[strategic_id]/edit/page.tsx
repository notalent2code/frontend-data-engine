'use client';

import { Strategic } from '@prisma/client';
import { useParams } from 'next/navigation';
import { Loader } from '@/components/ui/Loader';
import { useQuery } from '@tanstack/react-query';
import useAxiosPrivate from '@/hooks/use-axios-private';
import StrategicForm from '@/components/startup/forms/StrategicForm';

const Page = () => {
  const axios = useAxiosPrivate();
  const { strategic_id: strategicId } = useParams();

  const fetchStrategic = async () => {
    const { data } = await axios.get<Strategic>(`/strategic/${strategicId}`);
    return data;
  };

  const { data, isFetching } = useQuery({
    queryKey: ['strategic', strategicId],
    queryFn: fetchStrategic,
  });

  return isFetching ? (
    <Loader />
  ) : (
    <StrategicForm variant='edit' initialData={data} />
  );
};

export default Page;
