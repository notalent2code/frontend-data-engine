'use client';

import { ProblemSolutionFit } from '@prisma/client';
import { useParams } from 'next/navigation';
import { Loader } from '@/components/ui/Loader';
import { useQuery } from '@tanstack/react-query';
import useAxiosPrivate from '@/hooks/use-axios-private';
import PsfForm from '@/components/startup/forms/PsfForm';

const Page = () => {
  const axios = useAxiosPrivate();
  const { psf_id: psfId } = useParams();

  const fetchPsf = async () => {
    const { data } = await axios.get<ProblemSolutionFit>(`/psf/${psfId}`);
    return data;
  };

  const { data, isFetching } = useQuery({
    queryKey: ['psf', psfId],
    queryFn: fetchPsf,
  });

  return isFetching ? (
    <Loader />
  ) : (
    <PsfForm variant='edit' initialData={data} />
  );
};

export default Page;
