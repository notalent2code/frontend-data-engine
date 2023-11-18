'use client';

import { useMemo } from 'react';
import { StartupSectors } from '@/types';
import { AxisOptions, Chart } from 'react-charts';
import { useQuery } from '@tanstack/react-query';
import useAxiosPrivate from '@/hooks/use-axios-private';
import { Loader } from '@/components/ui/Loader';
import ResizableBox from '@/components/ResizeableBox';
import { Card, CardTitle } from '@/components/ui/Card';
import { Separator } from '@/components/ui/Separator';
import { enumReplacer } from '@/util';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

type TransformedData = {
  sector: string;
  type: string;
  value: number;
};

type ChartData = {
  label: string;
  data: TransformedData[];
};

const transformData = (data: StartupSectors | undefined): TransformedData[] => {
  const transformed: TransformedData[] = [];

  if (!data) return [];

  Object.entries(data).forEach(([sector, values]) => {
    Object.entries(values).forEach(([type, value]) => {
      transformed.push({
        sector,
        type,
        value,
      });
    });
  });

  return transformed;
};

const StartupSectors = () => {
  const axios = useAxiosPrivate();
  const router = useRouter();

  const fetchSectors = async () => {
    try {
      const { data } = await axios.get('/dashboard/sectors');
      return data as StartupSectors;
    } catch (error: any) {
      if (error.response.status === 403) {
        toast.error('You are not authorized to view this page');
      } else {
        toast.error('Something went wrong. Please try again later.');
      }
      router.push('/auth/login');
    }
  };

  const { data, isLoading } = useQuery({
    queryKey: ['startup-sectors'],
    queryFn: fetchSectors,
  });

  const chartData: ChartData[] = useMemo(() => {
    if (!data) return [];

    return [
      {
        label: 'PV',
        data: transformData(data).filter((d) => d.type === 'PV'),
      },
      {
        label: 'BMV',
        data: transformData(data).filter((d) => d.type === 'BMV'),
      },
      {
        label: 'MV',
        data: transformData(data).filter((d) => d.type === 'MV'),
      },
    ];
  }, [data]);

  const primaryAxis = useMemo<AxisOptions<TransformedData>>(
    () => ({
      getValue: (d: TransformedData) => enumReplacer(d.sector),
    }),
    []
  );

  const secondaryAxis = useMemo<AxisOptions<TransformedData>>(
    () => ({
      getValue: (d: TransformedData) => d.value,
      elementType: 'bar',
    }),
    []
  );

  const getSeriesStyle = useMemo(
    () => (series: any) => {
      const colors = ['#FF7878', '#FFC069', '#78C1F3'];
      return {
        color: colors[series.index % colors.length],
      };
    },
    []
  );

  return isLoading ? (
    <Loader />
  ) : data ? (
    <Card className='h-full w-full'>
      <CardTitle className='p-4 mx-4 pl-1 text-lg'>Startup Sectors</CardTitle>
      <Separator className='mb-4' />
      <ResizableBox className='mx-4 h-[300px] w-80 sm:w-96 md:w-[780px]'>
        <Chart
          options={{
            data: chartData,
            primaryAxis,
            secondaryAxes: [secondaryAxis],
            getSeriesStyle,
          }}
        />
      </ResizableBox>
    </Card>
  ) : null;
};

export default StartupSectors;
