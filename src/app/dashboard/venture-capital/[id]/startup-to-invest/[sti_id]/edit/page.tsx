'use client';

import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { StartupToInvest } from '@prisma/client';
import useAxiosPrivate from '@/hooks/use-axios-private';
import StartupToInvestForm from '@/components/venture-capital/StartupToInvestForm';

const Page = () => {
  const axios = useAxiosPrivate();
  const { sti_id: startupToInvestId } = useParams();

  const fetchStartupToInvest = async () => {
    const { data } = await axios.get(`/startup-to-invest/${startupToInvestId}`);
    return data as StartupToInvest;
  };

  const { data } = useQuery({
    queryKey: ['startup-to-invest', startupToInvestId],
    queryFn: fetchStartupToInvest,
  });

  return <StartupToInvestForm variant='edit' initialData={data} />;
};

export default Page;
