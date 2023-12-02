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
import { toast } from 'react-hot-toast';
import { FC, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Heading } from '@/components/ui/Heading';
import { People, Service } from '@prisma/client';
import { zodResolver } from '@hookform/resolvers/zod';
import { Separator } from '@/components/ui/Separator';
import useAxiosPrivate from '@/hooks/use-axios-private';
import { ServiceSchema } from '@/../prisma/generated/zod';
import { Input } from '@/components/ui/Input';

// Form schema
const baseServiceSchema = ServiceSchema.pick({
  title: true,
}).extend({
  startup_id: z.coerce.number().int(),
  revenue_percentage: z.coerce.number().int(),
});
const createServiceSchema = baseServiceSchema;
const editServiceSchema = baseServiceSchema.partial();

interface ServiceFormProps {
  variant: 'create' | 'edit';
  initialData?: Service;
}

const ServiceForm: FC<ServiceFormProps> = ({ variant, initialData }) => {
  const axios = useAxiosPrivate();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { id: startupId, service_id: serviceId } = useParams();

  // Forms
  const createForm = useForm<z.infer<typeof baseServiceSchema>>({
    resolver: zodResolver(createServiceSchema),
    defaultValues: {
      startup_id: parseInt(startupId as string),
    },
  });
  const editForm = useForm<z.infer<typeof baseServiceSchema>>({
    resolver: zodResolver(editServiceSchema),
    defaultValues: initialData,
  });

  const onSubmitCreate = async (data: z.infer<typeof createServiceSchema>) => {
    try {
      setIsLoading(true);

      await axios.post<Service>('/service', data);

      toast.success('Service created successfully!');
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

  const onSubmitEdit = async (data: z.infer<typeof editServiceSchema>) => {
    try {
      setIsLoading(true);

      await axios.patch<People>(`/service/${serviceId}`, data);

      toast.success('Service updated successfully!');
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
            title='Create Service'
            description='Create new service data.'
          />
        ) : (
          <Heading
            title='Edit Service'
            description='Edit existing service data.'
          />
        )}
        <Separator className='mt-4 lg:mt-0' />
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
          <div className='flex flex-col w-1/2 gap-4'>
            <FormField
              control={form.control}
              name='title'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='revenue_percentage'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Revenue Percentage</FormLabel>
                  <FormControl>
                    <Input type='number' {...field} />
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

export default ServiceForm;
