'use client';

import FinancialReportForm from '@/components/startup/forms/FinancialReportForm';
import { Loader } from '@/components/ui/Loader';
import useAxiosPrivate from '@/hooks/use-axios-private';
import { FinancialReport } from '@prisma/client';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';

const Page = () => {
  const axios = useAxiosPrivate();
  const { finance_id: financeId } = useParams();

  const fetchFinancialReport = async () => {
    const { data } = await axios.get<FinancialReport>(
      `/financial-report/${financeId}`
    );
    return data;
  };

  const { data, isFetching } = useQuery({
    queryKey: ['financial-report', financeId],
    queryFn: fetchFinancialReport,
  });

  return isFetching ? (
    <Loader />
  ) : (
    <FinancialReportForm variant='edit' initialData={data} />
  );
};

export default Page;
