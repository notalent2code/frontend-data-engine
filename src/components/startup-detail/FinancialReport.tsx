import { FC } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { FinancialReport } from '@prisma/client';
import { Heading } from '@/components/ui/Heading';
import { Separator } from '@/components/ui/Separator';
import { buttonVariants } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from 'chart.js';

interface FinancialReportProps {
  data: FinancialReport[] | null;
  addUrl: string;
  editUrl: string;
}

const separateDataByYear = (data: FinancialReport[]) => {
  return data.map((item) => ({
    year: item.year,
    datasets: [
      {
        label: 'Yearly Revenue',
        data: [item.yearly_revenue],
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        barPercentage: 0.2,
      },
      {
        label: 'Valuation',
        data: [item.valuation],
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
        barPercentage: 0.2,
      },
    ],
  }));
};

const FinancialReport: FC<FinancialReportProps> = ({
  data,
  addUrl,
  editUrl,
}) => {
  const separatedData = separateDataByYear(data || []);

  ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
  );

  return (
    <>
      <div className='pb-4'>
        <div className='flex flex-col pt-16 lg:pt-0 lg:flex-row items-start lg:items-center justify-between'>
          <Heading
            title='Financial Report'
            description='Startup financial report information.'
          />
          <Link
            href={addUrl + '/financial-report'}
            className={cn(
              buttonVariants({ size: 'lg' }),
              'bg-tertiary hover:bg-tertiary hover:opacity-90'
            )}
          >
            Add new
          </Link>
        </div>
        <Separator className='mt-4 lg:mt-0' />
      </div>
      <div className='flex flex-row gap-4'>
        {separatedData.map((yearData, index) => (
          <Card key={index} className='w-full h-full'>
            <Bar
              className='p-4'
              data={{
                labels: [yearData.year.toString()],
                datasets: yearData.datasets,
              }}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: 'top',
                  },
                },
              }}
            />
          </Card>
        ))}
      </div>
    </>
  );
};

export default FinancialReport;
