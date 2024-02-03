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
  synergyConfidenceLevelOptions,
  synergyModelOptions,
  synergyOutputOptions,
  synergyProgressOptions,
  synergyProjectStatusOptions,
} from '@/types';
import * as z from 'zod';
import { AxiosError } from 'axios';
import { enumReplacer } from '@/util';
import { toast } from 'react-hot-toast';
import { FC, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useParams, useRouter } from 'next/navigation';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Heading } from '@/components/ui/Heading';
import { People, Synergy } from '@prisma/client';
import { zodResolver } from '@hookform/resolvers/zod';
import { Separator } from '@/components/ui/Separator';
import useAxiosPrivate from '@/hooks/use-axios-private';
import { SynergySchema } from '@/../prisma/generated/zod';
import { Textarea } from '@/components/ui/TextArea';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/Popover';
import { cn } from '@/lib/utils';
import dayjs from 'dayjs';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/Calendar';

// Form schema
const baseSynergySchema = SynergySchema.omit({
  id: true,
  startup_id: true,
  lead_time_week: true,
  created_at: true,
  updated_at: true,
}).extend({
  startup_id: z.coerce.number().int(),
  lead_time_week: z.coerce.number().int(),
});
const createSynergySchema = baseSynergySchema;
const editSynergySchema = baseSynergySchema.partial();

interface SynergyFormProps {
  variant: 'create' | 'edit';
  initialData?: Synergy;
}

const SynergyForm: FC<SynergyFormProps> = ({ variant, initialData }) => {
  const axios = useAxiosPrivate();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { id: startupId, synergy_id: synergyId } = useParams();

  // Forms
  const createForm = useForm<z.infer<typeof baseSynergySchema>>({
    resolver: zodResolver(createSynergySchema),
    defaultValues: {
      startup_id: parseInt(startupId as string),
    },
  });

  const editForm = useForm<z.infer<typeof baseSynergySchema>>({
    resolver: zodResolver(editSynergySchema),
    defaultValues: initialData,
  });

  const onSubmitCreate = async (data: z.infer<typeof createSynergySchema>) => {
    try {
      setIsLoading(true);

      await axios.post<Synergy>('/synergy', {
        ...data,
        initiation_date: dayjs(data.initiation_date)
          .add(1, 'day')
          .toISOString(),
      });

      toast.success('Synergy created successfully!');
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

  const onSubmitEdit = async (data: z.infer<typeof editSynergySchema>) => {
    try {
      setIsLoading(true);

      await axios.patch<People>(`/synergy/${synergyId}`, data);

      if (
        data.initiation_date?.toISOString() !== initialData?.initiation_date
      ) {
        await axios.patch<Synergy>(`/synergy/${synergyId}`, {
          initiation_date: dayjs(data.initiation_date)
            .add(1, 'day')
            .toISOString(),
        });
      }

      toast.success('Synergy updated successfully!');
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
              name='telkom_group'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Telkom Group</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='entity'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Entity</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='model'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Model</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={initialData?.model}
                  >
                    <FormControl>
                      <SelectTrigger>
                        {initialData?.model ? (
                          <SelectValue
                            placeholder={enumReplacer(initialData?.model)}
                          />
                        ) : (
                          <SelectValue placeholder='Select model' />
                        )}
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {synergyModelOptions.map((option) => (
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
            <FormField
              control={form.control}
              name='progress'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Progress</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={initialData?.progress}
                  >
                    <FormControl>
                      <SelectTrigger>
                        {initialData?.progress ? (
                          <SelectValue
                            placeholder={enumReplacer(initialData?.progress)}
                          />
                        ) : (
                          <SelectValue placeholder='Select progress' />
                        )}
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {synergyProgressOptions.map((option) => (
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
              name='lead_time_week'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Lead Time Week</FormLabel>
                  <FormControl>
                    <Input type='number' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='output'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Output</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={initialData?.output}
                  >
                    <FormControl>
                      <SelectTrigger>
                        {initialData?.output ? (
                          <SelectValue
                            placeholder={enumReplacer(initialData?.output)}
                          />
                        ) : (
                          <SelectValue placeholder='Select output' />
                        )}
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {synergyOutputOptions.map((option) => (
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
              name='confidence_level'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confidence Level</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={initialData?.confidence_level}
                  >
                    <FormControl>
                      <SelectTrigger>
                        {initialData?.confidence_level ? (
                          <SelectValue
                            placeholder={enumReplacer(
                              initialData?.confidence_level
                            )}
                          />
                        ) : (
                          <SelectValue placeholder='Select confidence level' />
                        )}
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {synergyConfidenceLevelOptions.map((option) => (
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
              name='project_status'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Status</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={initialData?.project_status}
                  >
                    <FormControl>
                      <SelectTrigger>
                        {initialData?.project_status ? (
                          <SelectValue
                            placeholder={enumReplacer(
                              initialData?.project_status
                            )}
                          />
                        ) : (
                          <SelectValue placeholder='Select project status' />
                        )}
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {synergyProjectStatusOptions.map((option) => (
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
              name='initiation_date'
              render={({ field }) => (
                <FormItem className='flex flex-col'>
                  <FormLabel>Initiation Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={'outline'}
                          className={cn(
                            'w-[240px] pl-3 text-left font-normal',
                            !field.value && 'text-muted-foreground'
                          )}
                        >
                          {field.value ? (
                            dayjs(field.value).format('D MMMM YYYY')
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className='w-auto p-0' align='start'>
                      <Calendar
                        mode='single'
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date > new Date() || date < new Date('1900-01-01')
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormDescription>
                    Initiation date is the date when the synergy is started.
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

export default SynergyForm;
