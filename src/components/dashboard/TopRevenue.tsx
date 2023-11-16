'use client';

import useAxiosPrivate from '@/hooks/use-axios-private';
import { StartupRevenue } from '@/types';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { AxisOptions, Chart, Datum } from 'react-charts';
import { Loader } from '../ui/Loader';
import { Card, CardTitle } from '@/components/ui/Card';
import ResizableBox from '../ResizeableBox';
import { Separator } from '../ui/Separator';
import { formatToIndonesianRupiah } from '@/util';

type ChartData = {
  primary: string;
  secondary: number;
  color: string;
};

type TransformedData = Record<number, ChartData[]>;

const transformRevenueData = (
  data: StartupRevenue[] | undefined
): TransformedData => {
  const groupedData: TransformedData = {};

  if (!data) return {};

  const uniqueYears = Array.from(new Set(data.map((item) => item.year))).sort(
    (a, b) => b - a
  );
  const latestTwoYears = uniqueYears.slice(0, 2);

  const colors = ['#FF7878', '#FFC069', '#B08BBB', '#78C1F3', '#618264'];

  data.forEach(({ startup_name, yearly_revenue, year }, index) => {
    if (!latestTwoYears.includes(year)) return;

    const revenue = parseInt(yearly_revenue, 10);
    const entry: ChartData = {
      primary: startup_name,
      secondary: revenue,
      color: colors[index % colors.length],
    };

    if (!groupedData[year]) {
      groupedData[year] = [];
    }

    groupedData[year].push(entry);
  });

  return groupedData;
};

const TopRevenue = () => {
  const axios = useAxiosPrivate();

  const fetchTopRevenue = async () => {
    const { data } = await axios.get('/dashboard/top-revenue');
    return transformRevenueData(data as StartupRevenue[]);
  };

  const { data, isLoading } = useQuery({
    queryKey: ['top-revenue'],
    queryFn: fetchTopRevenue,
  });

  const chartData = useMemo(() => {
    if (!data) return [];

    return Object.entries(data).map(([year, startups]) => ({
      label: year,
      data: startups.map(({ primary, secondary, color }) => ({
        primary,
        secondary,
        color,
      })),
    }));
  }, [data]);

  const primaryAxis = useMemo<AxisOptions<ChartData>>(
    () => ({
      getValue: (d: ChartData) => d.primary,
      position: 'left',
      getSeriesOrder: (series: any) => series.label,
    }),
    []
  );

  const secondaryAxis = useMemo<AxisOptions<ChartData>>(
    () => ({
      getValue: (d: ChartData) => d.secondary,
      position: 'bottom',
      formatters: {
        scale: (value: number) =>
          `${formatToIndonesianRupiah(value, 'simple')}`,
      },
    }),
    []
  );

  const getDatumStyle = useMemo(
    () => (datum: Datum<ChartData>) => {
      const originalDatum = datum.originalDatum as ChartData;
      return {
        rectangle: {
          fill: originalDatum.color,
        },
      };
    },
    []
  );

  return isLoading ? (
    <Loader />
  ) : (
    chartData.map((series, index) => (
      <Card key={index} className='h-full'>
        <CardTitle className='p-4 mx-4 pl-1 text-lg'>
          Top Startup Revenue {series.label} (IDR)
        </CardTitle>
        <Separator className='mb-4' />
        <ResizableBox className='h-[120px] w-80 sm:w-96 md:w-[480px]'>
          <Chart
            options={{
              data: [series],
              primaryAxis,
              secondaryAxes: [secondaryAxis],
              getDatumStyle,
            }}
          />
        </ResizableBox>
      </Card>
    ))
  );
};

export default TopRevenue;
