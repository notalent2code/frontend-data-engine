'use client';

import {
  Form,
  FormControl,
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
import { strategicBusinessPointOptions } from '@/types';
import * as z from 'zod';
import { AxiosError } from 'axios';
import { enumReplacer } from '@/util';
import { toast } from 'react-hot-toast';
import { FC, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Heading } from '@/components/ui/Heading';
import { People, Strategic } from '@prisma/client';
import { zodResolver } from '@hookform/resolvers/zod';
import { Separator } from '@/components/ui/Separator';
import useAxiosPrivate from '@/hooks/use-axios-private';
import { StrategicSchema } from '@/../prisma/generated/zod';
import { Textarea } from '@/components/ui/TextArea';

// Form schema
const baseStrategicSchema = StrategicSchema.pick({
  business_point: true,
  description: true,
}).extend({
  startup_id: z.coerce.number().int(),
});
const createStrategicSchema = baseStrategicSchema;
const editStrategicSchema = baseStrategicSchema.partial();

interface StrategicFormProps {
  variant: 'create' | 'edit';
  initialData?: Strategic;
}

const StrategicForm: FC<StrategicFormProps> = ({ variant, initialData }) => {
  const axios = useAxiosPrivate();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { id: startupId, strategic_id: strategicId } = useParams();

  // Forms
  const createForm = useForm<z.infer<typeof baseStrategicSchema>>({
    resolver: zodResolver(createStrategicSchema),
    defaultValues: {
      startup_id: parseInt(startupId as string),
    },
  });
  const editForm = useForm<z.infer<typeof baseStrategicSchema>>({
    resolver: zodResolver(editStrategicSchema),
    defaultValues: initialData,
  });

  const onSubmitCreate = async (
    data: z.infer<typeof createStrategicSchema>
  ) => {
    try {
      setIsLoading(true);

      await axios.post<Strategic>('/strategic', data);

      toast.success('Strategic created successfully!');
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

  const onSubmitEdit = async (data: z.infer<typeof editStrategicSchema>) => {
    try {
      setIsLoading(true);

      await axios.patch<People>(`/strategic/${strategicId}`, data);

      toast.success('Strategic updated successfully!');
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
            title='Create Synergy'
            description='Create new synergy data.'
          />
        ) : (
          <Heading
            title='Edit Synergy'
            description='Edit existing synergy data.'
          />
        )}
        <Separator className='mt-4 lg:mt-0' />
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
          <div className='flex flex-col lg:w-1/2 gap-4'>
            <FormField
              control={form.control}
              name='business_point'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Business Point</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={initialData?.business_point}
                  >
                    <FormControl>
                      <SelectTrigger>
                        {initialData?.business_point ? (
                          <SelectValue
                            placeholder={enumReplacer(
                              initialData?.business_point
                            )}
                          />
                        ) : (
                          <SelectValue placeholder='Select business point' />
                        )}
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {strategicBusinessPointOptions.map((option) => (
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

export default StrategicForm;
