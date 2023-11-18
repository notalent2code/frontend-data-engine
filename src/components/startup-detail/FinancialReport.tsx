import { FC, useMemo } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { FinancialReport } from '@prisma/client';
import { Heading } from '@/components/ui/Heading';
import { Separator } from '@/components/ui/Separator';
import { buttonVariants } from '@/components/ui/Button';
import { Card, CardTitle } from '@/components/ui/Card';
import { AxisOptions, Chart } from 'react-charts';
import ResizableBox from '@/components/ResizeableBox';

interface FinancialReportProps {
  data: FinancialReport[] | null;
  addUrl: string;
  editUrl: string;
}

type FinancialDataPoint = {
  year: number;
  type: 'Yearly Revenue' | 'Valuation';
  value: bigint;
};

const transformFinancialData = (
  data: FinancialReport[] | null
): FinancialDataPoint[] => {
  const transformed: FinancialDataPoint[] = [];

  if (!data) return [];

  data.forEach((report) => {
    transformed.push({
      year: report.year,
      type: 'Yearly Revenue',
      value: report.yearly_revenue,
    });
    transformed.push({
      year: report.year,
      type: 'Valuation',
      value: report.valuation,
    });
  });

  return transformed;
};

const groupDataByYear = (
  data: FinancialDataPoint[]
): Record<string, FinancialDataPoint[]> => {
  return data.reduce((acc, curr) => {
    const year = curr.year.toString();
    if (!acc[year]) {
      acc[year] = [];
    }
    acc[year].push(curr);
    return acc;
  }, {} as Record<string, FinancialDataPoint[]>);
};

const FinancialReport: FC<FinancialReportProps> = ({
  data,
  addUrl,
  editUrl,
}) => {
  const primaryAxis = useMemo<AxisOptions<FinancialDataPoint>>(
    () => ({
      getValue: (d: FinancialDataPoint) => d.type,
    }),
    []
  );

  const secondaryAxis = useMemo<AxisOptions<FinancialDataPoint>>(
    () => ({
      getValue: (d: FinancialDataPoint) => d.value,
      elementType: 'bar',
    }),
    []
  );

  const chartData = useMemo(() => {
    if (!data) return [];

    return [
      {
        label: 'Yearly Revenue',
        data: transformFinancialData(data).filter(
          (d) => d.type === 'Yearly Revenue'
        ),
      },
      {
        label: 'Valuation',
        data: transformFinancialData(data).filter(
          (d) => d.type === 'Valuation'
        ),
      },
    ];
  }, [data]);

  const groupedData = useMemo(() => {
    if (!data) return [];

    return groupDataByYear(transformFinancialData(data));
  }, [data]);
  
  console.log('chartData', chartData)
  console.log('groupedData', groupedData)
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
      {data ? (
        <>
          {Object.entries(groupedData).map(([year]) => (
            <Card key={year} className='mb-6 h-full w-full'>
              <CardTitle className='p-4 mx-4 pl-1 text-lg'>
                Financial Report {year}
              </CardTitle>
              <ResizableBox className='mx-4 h-[300px] w-80 sm:w-96 md:w-[780px]'>
                <Chart
                  options={{
                    data: chartData,
                    primaryAxis,
                    secondaryAxes: [secondaryAxis],
                  }}
                />
              </ResizableBox>
            </Card>
          ))}
        </>
      ) : (
        <p>No financial report information found.</p>
      )}
    </>
  );
};

export default FinancialReport;
