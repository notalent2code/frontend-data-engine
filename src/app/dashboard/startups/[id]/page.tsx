'use client';

import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';
import { StartupDetail } from '@/types';
import Map from '@/components/Map';
import { Badge } from '@/components/ui/Badge';
import { Loader } from '@/components/ui/Loader';
import { useQuery } from '@tanstack/react-query';
import Alumni from '@/components/startup/Alumni';
import People from '@/components/startup/People';
import { useAuthStore } from '@/store/auth-store';
import Synergy from '@/components/startup/Synergy';
import Service from '@/components/startup/Service';
import Contract from '@/components/startup/Contract';
import { Separator } from '@/components/ui/Separator';
import { useParams, useRouter } from 'next/navigation';
import Strategic from '@/components/startup/Strategic';
import useAxiosPrivate from '@/hooks/use-axios-private';
import { buttonVariants } from '@/components/ui/Button';
import Performance from '@/components/startup/Performance';
import RevenueModel from '@/components/startup/RevenueModel';
import DeleteAlertDialog from '@/components/DeleteAlertDialog';
import GrowthStrategy from '@/components/startup/GrowthStrategy';
import FinancialReport from '@/components/startup/FinancialReport';
import ProblemSolutionFit from '@/components/startup/ProblemSolutionFit';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { enumReplacer } from '@/util';

const Page = () => {
  const axios = useAxiosPrivate();
  const router = useRouter();
  const { id: startupId } = useParams();
  const role = useAuthStore((state) => state.session?.role);

  const baseUrl = `/dashboard/startups/${startupId}`;
  const onepagerUrl = `/onepager/${startupId}`;

  const fetchStartupDetail = async () => {
    try {
      const { data } = await axios.get(`startups/${startupId}`);
      return data as StartupDetail;
    } catch (error: any) {
      toast.error('Something went wrong. Please try again later.');
      router.push('/auth/login');
    }
  };

  const deleteStartup = async () => {
    try {
      await axios.delete(`startups/${startupId}`);
      toast.success('Successfully deleted startup!');
      router.push('/dashboard/startups');
    } catch (error: any) {
      toast.error('Failed to delete startup!');
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
              {startup.logo_url ? (
                <Image
                  src={startup.logo_url}
                  width={80}
                  height={80}
                  alt={startup.name}
                />
              ) : (
                <div className='w-20 h-20 flex justify-center items-center bg-gray-200 rounded-md outline-dashed outline-gray-400'>
                  <p className='text-3xl text-gray-400'>?</p>
                </div>
              )}
            </div>
            <CardTitle>
              <h1 className='text-2xl font-bold'>{startup.name}</h1>
            </CardTitle>
          </div>
          <Badge>{enumReplacer(startup.category)}</Badge>
        </CardHeader>
      </Card>

      <Tabs defaultValue='summary'>
        <div className='flex flex-row justify-between'>
          <div className='flex flex-row gap-2 items-center'>
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
            <Link
              href={onepagerUrl}
              className={cn(
                buttonVariants({ size: 'sm' }),
                'bg-white text-tertiary hover:bg-white hover:opacity-90'
              )}
            >
              Onepager
            </Link>
          </div>
          {role === 'ADMIN' && (
            <div className={cn(buttonVariants(), 'hover:cursor-pointer')}>
              <DeleteAlertDialog deleteFn={deleteStartup} />
            </div>
          )}
        </div>
        <TabsContent value='summary' className='pt-6'>
          <div className='flex flex-row gap-4'>
            <Card className='w-1/2'>
              <CardHeader className='flex flex-row items-center justify-between p-4'>
                <CardTitle>
                  <h2 className='text-xl font-bold pt-2'>
                    General Information
                  </h2>
                </CardTitle>
                {role === 'ADMIN' && (
                  <Link
                    href={baseUrl + '/general/edit'}
                    className={cn(
                      buttonVariants(),
                      'bg-tertiary hover:bg-tertiary hover:opacity-90'
                    )}
                  >
                    Edit
                  </Link>
                )}
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
                      {enumReplacer(startup.latest_stage)}
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
                <p className='py-2 pb-4'>{startup.Location?.address}</p>
                {/* Google Maps Card */}
                {startup.Location?.latitude && startup.Location?.longitude ? (
                  <>
                    <Card>
                      <Map
                        latitude={startup.Location?.latitude}
                        longitude={startup.Location?.longitude}
                      />
                    </Card>
                    <p className='text-xs text-muted-foreground pt-2'>
                      If Google Maps marker not showing, try to reload the page.
                    </p>
                  </>
                ) : (
                  <p className='p-4'>No location data</p>
                )}
              </CardContent>
            </Card>

            <div className='flex flex-col gap-4 w-4/5'>
              <Performance role={role} data={startup.Performance} baseUrl={baseUrl} />

              <Alumni data={startup.Alumni} baseUrl={baseUrl} />
            </div>
          </div>
        </TabsContent>

        <TabsContent value='people' className='pt-6'>
          <People data={startup.People} baseUrl={baseUrl} />
        </TabsContent>

        <TabsContent value='financial' className='pt-6'>
          <div className='flex flex-col gap-2'>
            <Contract data={startup.Contract} baseUrl={baseUrl} />

            <FinancialReport data={startup.FinancialReport} baseUrl={baseUrl} />
          </div>
        </TabsContent>

        <TabsContent value='partnership' className='pt-6'>
          <Synergy data={startup.Synergy} baseUrl={baseUrl} />
        </TabsContent>

        <TabsContent value='strategy' className='flex flex-col gap-2 pt-6'>
          <Strategic data={startup.Strategic} baseUrl={baseUrl} />

          <Service data={startup.Service} baseUrl={baseUrl} />

          <ProblemSolutionFit
            data={startup.ProblemSolutionFit}
            baseUrl={baseUrl}
          />
        </TabsContent>

        <TabsContent
          value='revenue-growth'
          className='flex flex-col gap-2 pt-6'
        >
          <GrowthStrategy data={startup.GrowthStrategy} baseUrl={baseUrl} />

          <RevenueModel data={startup.RevenueModel} baseUrl={baseUrl} />
        </TabsContent>
      </Tabs>
    </div>
  ) : null;
};

export default Page;
