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
import { RevenueModel } from '@prisma/client';
import { zodResolver } from '@hookform/resolvers/zod';
import { Separator } from '@/components/ui/Separator';
import useAxiosPrivate from '@/hooks/use-axios-private';
import { RevenueModelSchema } from '@/../prisma/generated/zod';
import { Textarea } from '@/components/ui/TextArea';

// Form schema
const baseRevenueModelSchema = RevenueModelSchema.pick({
  description: true,
}).extend({
  startup_id: z.coerce.number().int(),
});
const createRevenueModelSchema = baseRevenueModelSchema;
const editRevenueModelSchema = baseRevenueModelSchema.partial();

interface RevenueModelFormProps {
  variant: 'create' | 'edit';
  initialData?: RevenueModel;
}

const RevenueModelForm: FC<RevenueModelFormProps> = ({
  variant,
  initialData,
}) => {
  const axios = useAxiosPrivate();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { id: startupId, rm_id: revenueModelId } = useParams();

  // Forms
  const createForm = useForm<z.infer<typeof baseRevenueModelSchema>>({
    resolver: zodResolver(createRevenueModelSchema),
    defaultValues: {
      startup_id: parseInt(startupId as string),
    },
  });
  const editForm = useForm<z.infer<typeof baseRevenueModelSchema>>({
    resolver: zodResolver(editRevenueModelSchema),
    defaultValues: initialData,
  });

  const onSubmitCreate = async (
    data: z.infer<typeof createRevenueModelSchema>
  ) => {
    try {
      setIsLoading(true);

      await axios.post<RevenueModel>('/revenue-model', data);

      toast.success('Revenue model created successfully!');
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
    data: z.infer<typeof editRevenueModelSchema>
  ) => {
    try {
      setIsLoading(true);

      await axios.patch<RevenueModel>(
        `/revenue-model/${revenueModelId}`,
        data
      );

      toast.success('Revenue model updated successfully!');
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
            title='Create Revenue Model'
            description='Create new revenue model data.'
          />
        ) : (
          <Heading
            title='Edit Revenue Model'
            description='Edit existing revenue model data.'
          />
        )}
        <Separator className='mt-4 lg:mt-0' />
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
          <div className='flex flex-col w-1/2 gap-4'>
            <FormField
              control={form.control}
              name='description'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
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

export default RevenueModelForm;
