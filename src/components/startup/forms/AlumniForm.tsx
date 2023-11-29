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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/Select';
import {
  AlumniClusterOptions,
  AlumniFundingStageOptions,
  AlumniIndustryClusterOptions,
  AlumniProductClusterOptions,
} from '@/types';
import * as z from 'zod';
import { AxiosError } from 'axios';
import { FC, useState } from 'react';
import { enumReplacer } from '@/util';
import { toast } from 'react-hot-toast';
import { Alumni } from '@prisma/client';
import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Switch } from '@/components/ui/Switch';
import { Heading } from '@/components/ui/Heading';
import { zodResolver } from '@hookform/resolvers/zod';
import { Separator } from '@/components/ui/Separator';
import { useParams, useRouter } from 'next/navigation';
import useAxiosPrivate from '@/hooks/use-axios-private';
import { AlumniSchema } from '@/../prisma/generated/zod';

// Form schema
const baseAlumniSchema = AlumniSchema.omit({
  id: true,
  startup_id: true,
  created_at: true,
  updated_at: true,
}).extend({
  startup_id: z.coerce.number().int(),
});
const createAlumniSchema = baseAlumniSchema;
const editAlumniSchema = baseAlumniSchema.partial();

interface AlumniFormProps {
  variant: 'create' | 'edit';
  initialData?: Alumni;
}

const AlumniForm: FC<AlumniFormProps> = ({ variant, initialData }) => {
  const axios = useAxiosPrivate();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { id: startupId, alumni_id: alumniId } = useParams();

  // Forms
  const createForm = useForm<z.infer<typeof baseAlumniSchema>>({
    resolver: zodResolver(createAlumniSchema),
    defaultValues: {
      startup_id: parseInt(startupId as string),
      is_product_stopped_or_vacuum: false,
      is_product_active_but_not_developed: false,
      is_startup_disband: false,
      is_startup_developed_other_product: false,
    },
  });
  const editForm = useForm<z.infer<typeof baseAlumniSchema>>({
    resolver: zodResolver(editAlumniSchema),
    defaultValues: {
      startup_id: parseInt(startupId as string),
      ...initialData,
    },
  });

  const onSubmitCreate = async (data: z.infer<typeof createAlumniSchema>) => {
    try {
      setIsLoading(true);

      await axios.post<Alumni>('/alumni', data);

      toast.success('Alumni created successfully!');
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

  const onSubmitEdit = async (data: z.infer<typeof editAlumniSchema>) => {
    try {
      setIsLoading(true);

      await axios.patch<Alumni>(`/alumni/${alumniId}`, data);

      toast.success('Alumni updated successfully!');
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
            title='Create Alumni'
            description='Create new alumni data.'
          />
        ) : (
          <Heading
            title='Edit Alumni'
            description='Edit existing alumni data.'
          />
        )}
        <Separator className='mt-4 lg:mt-0' />
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
          <div className='flex flex-col w-1/2 gap-4'>
            <FormField
              control={form.control}
              name='startup_id'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Startup ID</FormLabel>
                  <FormControl>
                    <Input {...field} type='number' disabled />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='cluster'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cluster</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={initialData?.cluster}
                  >
                    <FormControl>
                      <SelectTrigger>
                        {initialData?.cluster ? (
                          <SelectValue
                            placeholder={enumReplacer(initialData?.cluster)}
                          />
                        ) : (
                          <SelectValue placeholder='Select alumni cluster' />
                        )}
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {AlumniClusterOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='product_cluster'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Cluster</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={initialData?.product_cluster}
                  >
                    <FormControl>
                      <SelectTrigger>
                        {initialData?.product_cluster ? (
                          <SelectValue
                            placeholder={enumReplacer(
                              initialData?.product_cluster
                            )}
                          />
                        ) : (
                          <SelectValue placeholder='Select product cluster' />
                        )}
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {AlumniProductClusterOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='industry_cluster'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Industry Cluster</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={initialData?.industry_cluster}
                  >
                    <FormControl>
                      <SelectTrigger>
                        {initialData?.industry_cluster ? (
                          <SelectValue
                            placeholder={enumReplacer(
                              initialData?.industry_cluster
                            )}
                          />
                        ) : (
                          <SelectValue placeholder='Select industry cluster' />
                        )}
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {AlumniIndustryClusterOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='current_funding_stage'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Funding Stage</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={initialData?.current_funding_stage}
                  >
                    <FormControl>
                      <SelectTrigger>
                        {initialData?.current_funding_stage ? (
                          <SelectValue
                            placeholder={enumReplacer(
                              initialData?.current_funding_stage
                            )}
                          />
                        ) : (
                          <SelectValue placeholder='Select current funding stage' />
                        )}
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {AlumniFundingStageOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='is_product_stopped_or_vacuum'
              render={({ field }) => (
                <FormItem className='flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm'>
                  <div className='space-y-0.5'>
                    <FormLabel>Product stopped or halted</FormLabel>
                    <FormDescription>
                      Is the product stopped or halted?
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='is_product_active_but_not_developed'
              render={({ field }) => (
                <FormItem className='flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm'>
                  <div className='space-y-0.5'>
                    <FormLabel>Product active but not developed</FormLabel>
                    <FormDescription>
                      Is the product active but not developed?
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='is_startup_disband'
              render={({ field }) => (
                <FormItem className='flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm'>
                  <div className='space-y-0.5'>
                    <FormLabel>Startup disband</FormLabel>
                    <FormDescription>Is the startup disband?</FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='is_startup_developed_other_product'
              render={({ field }) => (
                <FormItem className='flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm'>
                  <div className='space-y-0.5'>
                    <FormLabel>Startup developed other product</FormLabel>
                    <FormDescription>
                      Is the startup developed other product?
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
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

export default AlumniForm;
