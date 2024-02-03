'use client';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/Form';
import * as z from 'zod';
import { AxiosError } from 'axios';
import { FC, useState } from 'react';
import { toast } from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { Performance } from '@prisma/client';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Heading } from '@/components/ui/Heading';
import { Textarea } from '@/components/ui/TextArea';
import { zodResolver } from '@hookform/resolvers/zod';
import { Separator } from '@/components/ui/Separator';
import { useParams, useRouter } from 'next/navigation';
import useAxiosPrivate from '@/hooks/use-axios-private';
// Form schema
const basePerformanceSchema = z.object({
  startup_id: z.number().int(),
  year: z.coerce.number().int(),
  performance_update: z.string(),
  people_update: z.string(),
  product_update: z.string(),
  action_plan: z.string(),
});
const createPerformanceSchema = basePerformanceSchema;
const editPerformanceSchema = basePerformanceSchema.partial();

interface PerformanceFormProps {
  variant: 'create' | 'edit';
  initialData?: Performance;
}

const PerformanceForm: FC<PerformanceFormProps> = ({
  variant,
  initialData,
}) => {
  const axios = useAxiosPrivate();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { id: startupId, perf_id: performanceId } = useParams();

  // Forms
  const createForm = useForm<z.infer<typeof basePerformanceSchema>>({
    resolver: zodResolver(createPerformanceSchema),
    defaultValues: {
      startup_id: parseInt(startupId as string),
    },
  });
  const editForm = useForm<z.infer<typeof basePerformanceSchema>>({
    resolver: zodResolver(editPerformanceSchema),
    defaultValues: {
      startup_id: parseInt(startupId as string),
      year: initialData?.year,
      performance_update: initialData?.performance_update?.toString(),
      people_update: initialData?.people_update?.toString(),
      product_update: initialData?.product_update?.toString(),
      action_plan: initialData?.action_plan?.toString(),
    },
  });

  const onSubmitCreate = async (
    data: z.infer<typeof createPerformanceSchema>
  ) => {
    try {
      setIsLoading(true);

      await axios.post<Performance>('/performance', data);

      toast.success('Performance created successfully!');
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

  const onSubmitEdit = async (data: z.infer<typeof editPerformanceSchema>) => {
    try {
      setIsLoading(true);

      await axios.patch<Performance>(`/performance/${performanceId}`, data);

      toast.success('Performance updated successfully!');
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
            title='Create Performance'
            description='Create new performance data.'
          />
        ) : (
          <Heading
            title='Edit Performance'
            description='Edit existing performance data.'
          />
        )}
        <Separator className='mt-4 lg:mt-0' />
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
          <div className='flex flex-col lg:w-1/2 gap-4'>
            <FormField
              control={form.control}
              name='year'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Year</FormLabel>
                  <FormControl>
                    <Input {...field} type='number' />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='performance_update'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Performance Update</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='people_update'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>People Update</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='product_update'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Update</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='action_plan'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Action Plan</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
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

export default PerformanceForm;
