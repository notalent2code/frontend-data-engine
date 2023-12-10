'use client';

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/Form';
import * as z from 'zod';
import { AxiosError } from 'axios';
import { toast } from 'react-hot-toast';
import { FC, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useParams, useRouter } from 'next/navigation';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Heading } from '@/components/ui/Heading';
import { FinancialReport } from '@prisma/client';
import { zodResolver } from '@hookform/resolvers/zod';
import { Separator } from '@/components/ui/Separator';
import useAxiosPrivate from '@/hooks/use-axios-private';

// Form schema
const baseFinancialReportSchema = z.object({
  startup_id: z.coerce.number().int(),
  year: z.coerce.number().int(),
  yearly_revenue: z.coerce.number().int(),
  valuation: z.coerce.number().int(),
});
const createFinancialReportSchema = baseFinancialReportSchema;
const editFinancialReportSchema = baseFinancialReportSchema.partial();

interface FinancialReportFormProps {
  variant: 'create' | 'edit';
  initialData?: FinancialReport;
}

const FinancialReportForm: FC<FinancialReportFormProps> = ({
  variant,
  initialData,
}) => {
  const axios = useAxiosPrivate();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { id: startupId, finance_id: financeId } = useParams();

  // Forms
  const createForm = useForm<z.infer<typeof baseFinancialReportSchema>>({
    resolver: zodResolver(createFinancialReportSchema),
    defaultValues: {
      startup_id: parseInt(startupId as string),
    },
  });
  const editForm = useForm<z.infer<typeof baseFinancialReportSchema>>({
    resolver: zodResolver(editFinancialReportSchema),
    defaultValues: {
      ...initialData,
      yearly_revenue: Number(initialData?.yearly_revenue),
      valuation: Number(initialData?.valuation),
    },
  });

  const onSubmitCreate = async (
    data: z.infer<typeof createFinancialReportSchema>
  ) => {
    try {
      setIsLoading(true);

      await axios.post<FinancialReport>('/financial-report', {
        ...data,
        monthly_revenue: Math.round(Number(data.yearly_revenue) / 12),
      });

      toast.success('Financial report created successfully');
      router.push(`/dashboard/startups/${startupId}`);
    } catch (error: any) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message);
      } else {
        toast.error('Something went wrong!');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmitEdit = async (
    data: z.infer<typeof editFinancialReportSchema>
  ) => {
    try {
      setIsLoading(true);

      await axios.patch<FinancialReport>(`/financial-report/${financeId}`, {
        ...data,
        monthly_revenue: Math.round(Number(data.yearly_revenue) / 12),
      });

      toast.success('Financial report updated successfully');
      router.push(`/dashboard/startups/${startupId}`);
    } catch (error: any) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message);
      } else {
        toast.error('Something went wrong!');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const form = variant === 'create' ? createForm : editForm;
  const onSubmit = variant === 'create' ? onSubmitCreate : onSubmitEdit;

  return (
    <div>
      <div className='pb-4'>
        {variant === 'create' ? (
          <Heading
            title='Create Financial Report'
            description='Create new financial report data.'
          />
        ) : (
          <Heading
            title='Edit Financial Report'
            description='Edit existing financial report data.'
          />
        )}
        <Separator className='mt-4 lg:mt-0' />
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
          <div className='flex flex-col w-1/2 gap-4'>
            <FormField
              control={form.control}
              name='year'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Year</FormLabel>
                  <FormControl>
                    <Input type='number' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='yearly_revenue'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Yearly Revenue (IDR)</FormLabel>
                  <FormControl>
                    <Input type='number' {...field} />
                  </FormControl>
                  <FormDescription>
                    Insert yearly revenue in IDR
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='valuation'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Valuation (IDR)</FormLabel>
                  <FormControl>
                    <Input type='number' {...field} />
                  </FormControl>
                  <FormDescription>
                    Insert valuation in IDR
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button type='submit' disabled={isLoading}>
            Submit
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default FinancialReportForm;
