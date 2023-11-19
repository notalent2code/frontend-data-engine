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

const transformFinancialData = (data: FinancialReport[] | null) => {
  const labels: string[] = [];
  const yearlyRevenueData: number[] = []; // Assuming these are numbers and not bigint
  const valuationData: number[] = []; // Adjust data types if necessary

  if (!data) return null;

  data.forEach((item) => {
    labels.push(item.year.toString());
    yearlyRevenueData.push(Number(item.yearly_revenue)); // Convert bigint to number if needed
    valuationData.push(Number(item.valuation)); // Convert bigint to number if needed
  });

  return { labels, yearlyRevenueData, valuationData };
};

const FinancialReport: FC<FinancialReportProps> = ({
  data,
  addUrl,
  editUrl,
}) => {
  const transformedData = transformFinancialData(data);

  if (!transformedData) return <p>No financial report information found.</p>;

  const { labels, yearlyRevenueData, valuationData } = transformedData;

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
          <div className='flex gap-4'>
            <Link
              href={addUrl + '/financial-report'}
              className={cn(buttonVariants({ size: 'lg' }))}
            >
              Add new
            </Link>
            {data && data.length > 0 && (
              <Link
                href={editUrl + '/financial-report'}
                className={cn(buttonVariants({ size: 'lg' }))}
              >
                Edit
              </Link>
            )}
          </div>
        </div>
        <Separator className='mt-4 lg:mt-0' />
      </div>
      {data && data.length > 0 ? (
        <div className='flex flex-col lg:flex-row gap-4'>
          <Card className='w-full'>
            <Bar
              className='p-4'
              data={{
                labels,
                datasets: [
                  {
                    label: 'Yearly Revenue',
                    data: yearlyRevenueData,
                    backgroundColor: '#78C1F3',
                    barPercentage: 0.2,
                  },
                ],
              }}
              options={{
                responsive: true,
                plugins: {
                  legend: { position: 'top' },
                },
              }}
            />
          </Card>
          <Card className='w-full'>
            <Bar
              className='p-4'
              data={{
                labels,
                datasets: [
                  {
                    label: 'Valuation',
                    data: valuationData,
                    backgroundColor: '#B08BBB',
                    barPercentage: 0.2,
                  },
                ],
              }}
              options={{
                responsive: true,
                plugins: {
                  legend: { position: 'top' },
                },
              }}
            />
          </Card>
        </div>
      ) : (
        <p className='text-sm text-muted-foreground'>
          No financial report data found.
        </p>
      )}
    </>
  );
};

export default FinancialReport;
