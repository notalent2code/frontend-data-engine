'use client';

import { Loader } from '@/components/ui/Loader';
import InvestorForm from '@/components/venture-capital/InvestorForm';
import useAxiosPrivate from '@/hooks/use-axios-private';
import { Investor } from '@prisma/client';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';

const Page = () => {
  const axios = useAxiosPrivate();
  const { id } = useParams();

  const fetchInvestor = async () => {
    const { data } = await axios.get(`/investor/${id}`);
    return data as Investor;
  };

  const { data, isFetching } = useQuery({
    queryKey: ['investor', id],
    queryFn: fetchInvestor,
  });

  return isFetching ? (
    <Loader />
  ) : (
    <InvestorForm variant='edit' initialData={data} />
  );
};

export default Page;
