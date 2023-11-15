'use client';

import useAxiosPrivate from '@/hooks/use-axios-private';
import { useQuery } from '@tanstack/react-query';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { enumReplacer } from '@/util';
import { Loader } from '@/components/ui/Loader';
import { Card, CardTitle } from '@/components/ui/Card';
import { GameStages } from '@/types';
import { Separator } from '../ui/Separator';

const transformData = (data: GameStages) => {
  let labels: Array<keyof GameStages> = [];
  let values: number[] = [];

  if (data) {
    labels = Object.keys(data).filter((key) => key !== 'total') as Array<
      keyof GameStages
    >;
    values = labels.map((key) => data[key]);
  }

  return {
    labels,
    values,
  };
};

const GameStages = () => {
  const axios = useAxiosPrivate();

  const fetchGameStages = async () => {
    const { data } = await axios.get('/dashboard/game-stages');

    return data as GameStages;
  };

  const { data, isLoading } = useQuery({
    queryKey: ['game-stages'],
    queryFn: fetchGameStages,
  });

  const { labels, values } = transformData(data!);

  ChartJS.register(ArcElement, Tooltip, Legend);

  const chartData = {
    labels: labels.map((label) => enumReplacer(label)),
    datasets: [
      {
        label: 'Game Stages',
        data: values,
        backgroundColor: [
          'rgba(255, 99, 132, 0.5)',
          'rgba(54, 162, 235, 0.5)',
          'rgba(255, 206, 86, 0.5)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  return isLoading ? (
    <Loader />
  ) : (
    <Card className='flex flex-col items-center h-full'>
      <CardTitle className='py-4'>Startup Game Stages</CardTitle>
      <Separator />
      <Doughnut data={chartData} className='p-4' />
    </Card>
  );
};

export default GameStages;
