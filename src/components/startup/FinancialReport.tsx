'use client';

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
  Tooltip as ChartTooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from 'chart.js';
import useAxiosPrivate from '@/hooks/use-axios-private';
import { useAuthStore } from '@/store/auth-store';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/Tooltip';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/Table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/AlertDialog';
import { Edit, Trash2 } from 'lucide-react';
import { formatCurrencyValue } from '@/util';
import toast from 'react-hot-toast';

interface FinancialReportProps {
  data: FinancialReport[] | null;
  baseUrl: string;
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

const FinancialReport: FC<FinancialReportProps> = ({ data, baseUrl }) => {
  const axios = useAxiosPrivate();
  const role = useAuthStore((state) => state.session?.role);

  const deleteFinancialReport = async (id: string) => {
    try {
      await axios.delete(`/financial-report/${id}`);
      toast.success('Financial report data deleted successfully.');
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (err) {
      toast.error('Failed to delete financial report!');
    }
  };

  const transformedData = transformFinancialData(data);
  if (!transformedData) return <p>No financial report information found.</p>;

  const { labels, yearlyRevenueData, valuationData } = transformedData;

  ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    ChartTooltip,
    Legend
  );

  return (
    <>
      <div className='pt-4'>
        <div className='flex flex-col pt-16 lg:pt-0 lg:flex-row items-start lg:items-center justify-between'>
          <Heading
            title='Financial Report'
            description='Startup financial report information.'
          />
          <div className='flex gap-4'>
            {role === 'ADMIN' && (
              <Link
                href={baseUrl + '/financial-report/create'}
                className={cn(
                  buttonVariants({ size: 'sm' }),
                  'bg-tertiary hover:bg-tertiary hover:opacity-90'
                )}
              >
                Add new
              </Link>
            )}
          </div>
        </div>
        <Separator className='mt-4 lg:mt-0' />
      </div>
      {data && data.length > 0 ? (
        <div className='flex flex-col gap-4 pt-4'>
          <div className='flex flex-col lg:flex-row gap-4'>
            <Card className='max-w-[360px] md:max-w-6xl'>
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
            <Card className='max-w-[360px] md:max-w-6xl'>
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
          <Card>
            <div className='overflow-auto max-h-[500px] max-w-[360px] md:max-w-6xl'>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className='p-5'>Year</TableHead>
                    <TableHead>Yearly Revenue</TableHead>
                    <TableHead>Monthly Revenue</TableHead>
                    <TableHead>Valuation</TableHead>
                    {role === 'ADMIN' && <TableHead>Actions</TableHead>}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className='p-5'>{item.year}</TableCell>
                      <TableCell>
                        {formatCurrencyValue(Number(item.yearly_revenue))}
                      </TableCell>
                      <TableCell>
                        {formatCurrencyValue(Number(item.monthly_revenue))}
                      </TableCell>
                      <TableCell>
                        {formatCurrencyValue(Number(item.valuation))}
                      </TableCell>
                      {role === 'ADMIN' && (
                        <TableCell>
                          <div className='flex flex-row gap-2'>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger>
                                  <Link
                                    href={`${baseUrl}/financial-report/${item.id}/edit`}
                                  >
                                    <Edit className='h-6 w-6' />
                                  </Link>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Edit data</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>

                            <AlertDialog>
                              <AlertDialogTrigger>
                                <Trash2 className='h-6 w-6' />
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>
                                    Are you absolutely sure?
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Please be aware that this action is
                                    irreversible. Once completed, the data will
                                    be permanently erased and cannot be
                                    retrieved.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() =>
                                      deleteFinancialReport(item.id)
                                    }
                                  >
                                    Continue
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>
        </div>
      ) : (
        <p className='text-sm text-muted-foreground py-2'>
          No financial report data found.
        </p>
      )}
    </>
  );
};

export default FinancialReport;
