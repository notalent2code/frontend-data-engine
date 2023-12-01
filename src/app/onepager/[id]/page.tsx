'use client';

import Link from 'next/link';
import Image from 'next/image';
import toast from 'react-hot-toast';
import { enumReplacer } from '@/util';
import { StartupDetail } from '@/types';
import { People } from '@prisma/client';
import { Badge } from '@/components/ui/Badge';
import { Loader } from '@/components/ui/Loader';
import { useQuery } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import useAxiosPrivate from '@/hooks/use-axios-private';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import ServicePieChart from '@/components/onepager/ServicePieChart';
import FinancialBarChart from '@/components/onepager/FinancialBarChart';
import { BarChart2, Briefcase, UserCircle2, Users2 } from 'lucide-react';

function findPersonWithQrCode(people: People[] | undefined) {
  if (!people) return null;

  const peopleWithQrCode = people.filter((person) => person.qr_code_url);

  const ceoWithQrCode = peopleWithQrCode.find(
    (person) => person.job_title === 'CEO'
  );

  return ceoWithQrCode || peopleWithQrCode[0] || null;
}

const Page = () => {
  const axios = useAxiosPrivate();
  const router = useRouter();
  const { id: startupId } = useParams();

  const fetchOnepager = async () => {
    try {
      const { data } = await axios.get(`startups/${startupId}`);
      return data as StartupDetail;
    } catch (error: any) {
      toast.error('Something went wrong. Please try again later.');
      router.push('/auth/login');
    }
  };

  const {
    data: startup,
    error,
    isLoading,
  } = useQuery({
    queryKey: ['startups', startupId],
    queryFn: fetchOnepager,
  });

  const personWithQrCode = findPersonWithQrCode(startup?.People);

  return isLoading ? (
    <Loader />
  ) : error ? (
    <p>Error: {error.message}</p>
  ) : startup ? (
    <div className='grid grid-flow-row gap-4 p-4'>
      <Card>
        <CardHeader className='flex flex-row items-center justify-between py-0 px-4'>
          <div className='flex flex-row items-center gap-4'>
            <div className='w-20 h-20 flex justify-start items-center'>
              <Image
                src={startup.logo_url}
                width={80}
                height={80}
                alt={startup.name}
              />
            </div>
            <CardTitle>
              <h1 className='text-2xl font-bold'>{startup.name}</h1>
            </CardTitle>
          </div>
          <Badge>{startup.category}</Badge>
        </CardHeader>
      </Card>
      <div className='flex flex-row gap-4'>
        <Card className='flex flex-col p-4 max-w-md'>
          <h1 className='text-xl font-bold pb-2'>About company</h1>
          <p className='text-sm'>{startup.description}</p>
        </Card>

        <Card className='flex flex-col p-4 w-full'>
          <h1 className='text-xl font-bold pb-2'>Our team</h1>
          <div className='flex flex-row gap-4'>
            {startup.People.map((person) => (
              <Card key={person.id} className='w-fit'>
                <CardHeader className='flex flex-row items-center justify-between'>
                  <div className='flex justify-start items-center gap-4'>
                    {person.photo_url ? (
                      <div className='w-20 h-20 overflow-hidden rounded-full'>
                        <Image
                          src={person.photo_url}
                          width={80}
                          height={80}
                          alt={person.name}
                          className='w-full h-full object-cover rounded-full'
                        />
                      </div>
                    ) : (
                      <UserCircle2 width={80} height={80} color='grey' />
                    )}
                    <div>
                      <p>{person.name}</p>
                      <Badge>{enumReplacer(person.job_title)}</Badge>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </Card>

        <Card className='flex flex-col p-4 items-center'>
          <h1 className='text-xl font-bold'>Contact</h1>
          {personWithQrCode?.qr_code_url && (
            <Image
              src={personWithQrCode.qr_code_url}
              width={120}
              height={120}
              alt='qr-code'
            />
          )}
          <Link
            href={`https://wa.me/${personWithQrCode?.phone_number}`}
            target='_blank'
          >
            <span className='text-sm text-muted-foreground'>
              {personWithQrCode?.phone_number}
            </span>
          </Link>
        </Card>
      </div>

      <div className='flex flex-row gap-4'>
        <Card className='flex flex-col p-4'>
          <h1 className='text-xl font-bold'>Strategic and Business Point</h1>
          {startup.Strategic.map((item) => (
            <div key={item.id}>
              <div className='grid grid-flow-row py-2'>
                <div className='flex flex-row justify-start gap-2'>
                  {item.business_point === 'BUSINESS_MODEL' ? (
                    <Briefcase className='w-6 h-6' color='red' />
                  ) : item.business_point === 'PARTNERSHIP' ? (
                    <Users2 className='w-6 h-6' color='red' />
                  ) : item.business_point === 'TRACTION' ? (
                    <BarChart2 className='w-6 h-6' color='red' />
                  ) : null}
                  <span className='font-semibold'>
                    {enumReplacer(item.business_point)}
                  </span>
                </div>
                <p>{item.description}</p>
              </div>
            </div>
          ))}
        </Card>
        <FinancialBarChart data={startup.FinancialReport} />
      </div>

      <div className='flex flex-row gap-4'>
        <Card className='flex flex-col p-4 w-full'>
          <h1 className='text-xl font-bold pb-2'>Problem Solution Fit</h1>
          {startup.ProblemSolutionFit.map((psf) => (
            <div
              key={psf.id}
              className='flex flex-col items-start justify-start pb-2'
            >
              <span className='font-bold'>{psf.title}</span>
              <p>{psf.description}</p>
            </div>
          ))}
        </Card>
        <Card className='flex flex-col p-4 w-full'>
          <div className='pb-4'>
            <h1 className='text-xl font-bold pb-2'>Growth Strategy</h1>
            <ul className='list-disc pl-4'>
              {startup.GrowthStrategy.map((item) => (
                <li key={item.id}>{item.description}</li>
              ))}
            </ul>
          </div>
          <div className=''>
            <h1 className='text-xl font-bold pb-2'>Revenue Model</h1>
            <ul className='list-disc pl-4'>
              {startup.RevenueModel.map((item) => (
                <li key={item.id}>{item.description}</li>
              ))}
            </ul>
          </div>
        </Card>
        <Card className='flex flex-col gap-4 p-4 items-center'>
          <h1 className='text-xl font-bold pb-2'>Services</h1>
          <ServicePieChart data={startup.Service} />
        </Card>
      </div>

      <div className='flex flex-row gap-4'></div>
    </div>
  ) : null;
};

export default Page;
