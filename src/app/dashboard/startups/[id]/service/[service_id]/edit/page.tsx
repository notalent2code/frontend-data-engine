'use client';

import { Service } from '@prisma/client';
import { useParams } from 'next/navigation';
import { Loader } from '@/components/ui/Loader';
import { useQuery } from '@tanstack/react-query';
import useAxiosPrivate from '@/hooks/use-axios-private';
import ServiceForm from '@/components/startup/forms/ServiceForm';

const Page = () => {
  const axios = useAxiosPrivate();
  const { service_id: serviceId } = useParams();

  const fetchService = async () => {
    const { data } = await axios.get<Service>(`/service/${serviceId}`);
    return data;
  };

  const { data, isFetching } = useQuery({
    queryKey: ['service', serviceId],
    queryFn: fetchService,
  });

  return isFetching ? (
    <Loader />
  ) : (
    <ServiceForm variant='edit' initialData={data} />
  );
};

export default Page;
