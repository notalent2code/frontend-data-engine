'use client';

import { useMemo } from 'react';
import { StartupSectors } from '@/types';
import { AxisOptions, Chart } from 'react-charts';
import { useQuery } from '@tanstack/react-query';
import useAxiosPrivate from '@/hooks/use-axios-private';
import { Loader } from '@/components/ui/Loader';
import ResizableBox from '@/components/ResizeableBox';
import { Card, CardTitle } from '@/components/ui/Card';
import { Separator } from '../ui/Separator';

const transformData = (data: StartupSectors) => {
  const transformed: any[] = [];

  if (data) {
    Object.entries(data).forEach(([sector, values]) => {
      Object.entries(values).forEach(([type, value]) => {
        transformed.push({
          sector,
          type,
          value,
        });
      });
    });
  }

  return transformed;
};

const StartupSectors = () => {
  const axios = useAxiosPrivate();

  const fetchSectors = async () => {
    const { data } = await axios.get('/dashboard/sectors');

    return data as StartupSectors;
  };

  const { data, isLoading } = useQuery({
    queryKey: ['startup-sectors'],
    queryFn: fetchSectors,
  });

  const chartData: any = useMemo(() => {
    return [
      {
        label: 'PV',
        data: transformData(data!).filter((d) => d.type === 'PV'),
      },
      {
        label: 'BMV',
        data: transformData(data!).filter((d) => d.type === 'BMV'),
      },
      {
        label: 'MV',
        data: transformData(data!).filter((d) => d.type === 'MV'),
      },
    ];
  }, [data]);

  const primaryAxis = useMemo(
    () => ({
      getValue: (d: any) => d.sector,
    }),
    []
  );

  const secondaryAxis = useMemo<AxisOptions<any>>(
    () => ({
      getValue: (d: any) => d.value,
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
  ) : (
    <Card className='h-full'>
      <CardTitle className='p-4 mx-4 pl-1 text-lg'>Startup Sectors</CardTitle>
      <Separator className='mb-4' />
      <ResizableBox className='mx-4 h-[300px] w-80 sm:w-96 md:w-[600px]'>
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
  );
};

export default StartupSectors;
