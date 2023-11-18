'use client';

import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import GoogleMaps from '@/components/Map';
import toast from 'react-hot-toast';
import { StartupDetail } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { Loader } from '@/components/ui/Loader';
import { useQuery } from '@tanstack/react-query';
import { Separator } from '@/components/ui/Separator';
import { useParams, useRouter } from 'next/navigation';
import useAxiosPrivate from '@/hooks/use-axios-private';
import { buttonVariants } from '@/components/ui/Button';
import Alumni from '@/components/startup-detail/Alumni';
import People from '@/components/startup-detail/People';
import Performance from '@/components/startup-detail/Performance';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';

const Page = () => {
  const axios = useAxiosPrivate();
  const router = useRouter();
  const { id: startupId } = useParams();

  const addUrl = `/dashboard/startups/${startupId}/add`;
  const editUrl = `/dashboard/startups/${startupId}/edit`;

  const fetchStartupDetail = async () => {
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
    queryFn: fetchStartupDetail,
  });

  return isLoading ? (
    <Loader />
  ) : error ? (
    <div>Error: {error.message}</div>
  ) : startup ? (
    <div className='grid grid-flow-row gap-8'>
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

      <Tabs defaultValue='summary'>
        <TabsList className='grid grid-cols-2 md:grid-cols-3 lg:grid-flow-col items-center justify-start w-fit gap-2'>
          {/* Startup & Location & Alumni & Performance */}
          <TabsTrigger value='summary'>Summary</TabsTrigger>
          {/* People */}
          <TabsTrigger value='people'>People</TabsTrigger>
          {/* Contract & FinancialReport */}
          <TabsTrigger value='financial'>Financial</TabsTrigger>
          {/* StartupToInvest & Synergy */}
          <TabsTrigger value='partnership'>Partnership</TabsTrigger>
          {/* Strategic & Service & ProblemSolutionFit */}
          <TabsTrigger value='strategy'>Strategy</TabsTrigger>
          {/* GrowthStrategy & RevenueModel */}
          <TabsTrigger value='revenue-growth'>Revenue Growth</TabsTrigger>
        </TabsList>
        <TabsContent value='summary' className='pt-6'>
          <div className='flex flex-row gap-4'>
            <Card className='w-1/2'>
              <CardHeader className='flex flex-row items-center justify-between p-4'>
                <CardTitle>
                  <h2 className='text-xl font-bold pt-2'>
                    General Information
                  </h2>
                </CardTitle>
                <Link
                  href={editUrl + '/general'}
                  className={cn(
                    buttonVariants({ size: 'lg' }),
                    'bg-tertiary hover:bg-tertiary hover:opacity-90'
                  )}
                >
                  Edit
                </Link>
              </CardHeader>
              <Separator />
              <CardContent className='p-4 text-sm'>
                <p>{startup.description}</p>
                <div className='grid grid-cols-1 lg:grid-cols-3 gap-4 pt-4'>
                  <Badge
                    className='flex flex-col p-2 bg-white hover:bg-white outline outline-tertiary
                    text-muted-foreground'
                  >
                    <span className='pb-2 text-center'>Latest Stage</span>
                    <p className='font-bold text-center'>
                      {startup.latest_stage}
                    </p>
                  </Badge>
                  <Badge
                    className='flex flex-col p-2 bg-white hover:bg-white outline outline-tertiary
                    text-muted-foreground'
                  >
                    <span className='pb-2 text-center'>Status</span>
                    <p className='font-bold text-center'>{startup.status}</p>
                  </Badge>
                  <Badge
                    className='flex flex-col p-2 bg-white hover:bg-white outline outline-tertiary
                    text-muted-foreground'
                  >
                    <span className='pb-2 text-center'>Intake Type</span>
                    <p className='font-bold text-center'>
                      {startup.intake_type}
                    </p>
                  </Badge>
                  <Badge className='flex justify-center w-full'>
                    {startup.intake_year}
                  </Badge>
                  <Link href={startup.pitchdeck_url}>
                    <Badge className='flex justify-center w-full'>
                      Pitchdeck
                    </Badge>
                  </Link>
                  <Link href={startup.website_url}>
                    <Badge className='flex justify-center w-full'>
                      Website
                    </Badge>
                  </Link>
                </div>

                <p className='pt-4 text-lg font-bold'>Full Address</p>
                <p className='py-2 pb-4'>{startup.Location.address}</p>
                {/* Google Maps Card */}
                <Card>
                  {startup.Location.latitude && startup.Location.longitude ? (
                    <GoogleMaps
                      latitude={startup.Location.latitude}
                      longitude={startup.Location.longitude}
                    />
                  ) : (
                    <p className='p-4'>No location data</p>
                  )}
                </Card>
              </CardContent>
            </Card>

            <div className='flex flex-col gap-4 w-4/5'>
              <Performance
                data={startup.Performance}
                addUrl={addUrl}
                editUrl={editUrl}
              />

              <Alumni
                data={startup.Alumni}
                addUrl={addUrl}
                editUrl={editUrl}
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value='people' className='pt-6'>
          <People data={startup.People} addUrl={addUrl} editUrl={editUrl} />
        </TabsContent>
      </Tabs>
    </div>
  ) : null;
};

export default Page;
