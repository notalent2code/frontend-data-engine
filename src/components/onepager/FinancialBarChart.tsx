import { FC } from 'react';
import { FinancialReport } from '@prisma/client';
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

interface FinancialBarChartProps {
  data: FinancialReport[] | null;
}

const transformFinancialData = (data: FinancialReport[] | null) => {
  const labels: string[] = [];
  const yearlyRevenueData: number[] = [];
  const valuationData: number[] = [];

  if (!data) return null;

  data.forEach((item) => {
    labels.push(item.year.toString());
    yearlyRevenueData.push(Number(item.yearly_revenue));
    valuationData.push(Number(item.valuation));
  });

  return { labels, yearlyRevenueData, valuationData };
};

const FinancialBarChart: FC<FinancialBarChartProps> = ({ data }) => {
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
      {data && data.length > 0 ? (
        <div className='flex flex-col lg:flex-row items-center justify-center gap-4'>
          <Card className='flex flex-col items-center justify-center h-full w-full'>
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
          <Card className='flex flex-col items-center justify-center h-full w-full'>
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

export default FinancialBarChart;
