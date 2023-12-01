'use client';

import { Contract } from '@prisma/client';
import { useParams } from 'next/navigation';
import { Loader } from '@/components/ui/Loader';
import { useQuery } from '@tanstack/react-query';
import useAxiosPrivate from '@/hooks/use-axios-private';
import ContractForm from '@/components/startup/forms/ContractForm';

const Page = () => {
  const axios = useAxiosPrivate();
  const { contract_id: contractId } = useParams();

  const fetchContract = async () => {
    const { data } = await axios.get<Contract>(`/contract/${contractId}`);
    return data;
  };

  const { data, isFetching } = useQuery({
    queryKey: ['contract', contractId],
    queryFn: fetchContract,
  });

  return isFetching ? (
    <Loader />
  ) : (
    <ContractForm variant='edit' initialData={data} />
  );
};

export default Page;
