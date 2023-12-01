'use client';
import PeopleForm from '@/components/startup/forms/PeopleForm';
import { Loader } from '@/components/ui/Loader';
import useAxiosPrivate from '@/hooks/use-axios-private';
import { People } from '@prisma/client';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';

const Page = () => {
  const axios = useAxiosPrivate();
  const { person_id: personId } = useParams();

  const fetchPerson = async () => {
    const { data } = await axios.get<People>(`/people/${personId}`);
    return data;
  };

  const { data, isFetching } = useQuery({
    queryKey: ['people', personId],
    queryFn: fetchPerson,
  });

  return isFetching ? (
    <Loader />
  ) : (
    <PeopleForm variant='edit' initialData={data} />
  );
};

export default Page;
