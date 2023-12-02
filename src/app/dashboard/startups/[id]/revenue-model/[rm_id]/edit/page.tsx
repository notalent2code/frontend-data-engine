'use client';

import { RevenueModel } from '@prisma/client';
import { useParams } from 'next/navigation';
import { Loader } from '@/components/ui/Loader';
import { useQuery } from '@tanstack/react-query';
import useAxiosPrivate from '@/hooks/use-axios-private';
import RevenueModelForm from '@/components/startup/forms/RevenueModelForm';

const Page = () => {
  const axios = useAxiosPrivate();
  const { rm_id: revenuemodelId } = useParams();

  const fetchRevenueModel = async () => {
    const { data } = await axios.get<RevenueModel>(
      `/revenue-model/${revenuemodelId}`
    );
    return data;
  };

  const { data, isFetching } = useQuery({
    queryKey: ['revenue-model', revenuemodelId],
    queryFn: fetchRevenueModel,
  });

  return isFetching ? (
    <Loader />
  ) : (
    <RevenueModelForm variant='edit' initialData={data} />
  );
};

export default Page;
