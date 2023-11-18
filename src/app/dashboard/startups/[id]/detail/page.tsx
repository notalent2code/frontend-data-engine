'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import useAxiosPrivate from '@/hooks/use-axios-private';
import { StartupDetail } from '@/types';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/Badge';
import { buttonVariants } from '@/components/ui/Button';
import { Loader } from '@/components/ui/Loader';
import { Separator } from '@/components/ui/Separator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import toast from 'react-hot-toast';
import PerformanceAccordion from '@/components/startup-detail/PerformanceAccordion';
import Map from '@/components/Map';

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
                <div className='grid grid-cols-3 gap-4 pt-4'>
                  <Badge
                    className='flex flex-col p-2 bg-white hover:bg-white outline outline-tertiary
                    text-muted-foreground'
                  >
                    <span className='pb-2'>Latest Stage</span>
                    <p className='font-bold'>{startup.latest_stage}</p>
                  </Badge>
                  <Badge
                    className='flex flex-col p-2 bg-white hover:bg-white outline outline-tertiary
                    text-muted-foreground'
                  >
                    <span className='pb-2'>Status</span>
                    <p className='font-bold'>{startup.status}</p>
                  </Badge>
                  <Badge
                    className='flex flex-col p-2 bg-white hover:bg-white outline outline-tertiary
                    text-muted-foreground'
                  >
                    <span className='pb-2'>Intake Type</span>
                    <p className='font-bold'>{startup.intake_type}</p>
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
                    <Map
                      latitude={startup.Location.latitude}
                      longitude={startup.Location.longitude}
                    />
                  ) : (
                    <p className='p-4'>No location data</p>
                  )}
                </Card>
              </CardContent>
            </Card>

            <Card className='w-4/5'>
              <CardHeader className='flex flex-row items-center justify-between p-4'>
                <CardTitle>
                  <h2 className='text-xl font-bold pt-2'>Performance</h2>
                </CardTitle>
                <Link
                  href={addUrl + '/performance'}
                  className={cn(
                    buttonVariants(),
                    'bg-tertiary hover:bg-tertiary hover:opacity-90'
                  )}
                >
                  Add new
                </Link>
              </CardHeader>
              <Separator />
              <CardContent className='py-0 px-4 text-sm'>
                <PerformanceAccordion
                  data={startup.Performance}
                  editUrl={editUrl}
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  ) : null;
};

export default Page;
