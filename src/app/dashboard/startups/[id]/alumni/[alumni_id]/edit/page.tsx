'use client';

import { Alumni } from '@prisma/client';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import useAxiosPrivate from '@/hooks/use-axios-private';
import AlumniForm from '@/components/startup/forms/AlumniForm';

const Page = () => {
  const axios = useAxiosPrivate();
  const { alumni_id: alumniId } = useParams();

  const fetchAlumni = async () => {
    const { data } = await axios.get<Alumni>(`/alumni/${alumniId}`);
    return data;
  };

  const { data } = useQuery({
    queryKey: ['alumni', alumniId],
    queryFn: fetchAlumni,
  });

  return <AlumniForm variant='edit' initialData={data} />;
};

export default Page;
