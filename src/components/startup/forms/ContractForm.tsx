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
import { contractStatusOptions } from '@/types';
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
import { Contract } from '@prisma/client';
import { zodResolver } from '@hookform/resolvers/zod';
import { Separator } from '@/components/ui/Separator';
import useAxiosPrivate from '@/hooks/use-axios-private';
import { ContractSchema } from '@/../prisma/generated/zod';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/Popover';
import dayjs from 'dayjs';
import { cn } from '@/lib/utils';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/Calendar';

// Form schema
const baseContractSchema = ContractSchema.pick({
  pks_number: true,
  signed_pks_date: true,
  closing_bak_date: true,
  convertible_note_status: true,
}).extend({
  startup_id: z.coerce.number().int(),
  total_funding: z.coerce.number().int(),
  convertible_note: z.coerce.number().min(0).max(1),
  convertible_note_year: z.coerce.number().int(),
  convertible_note_months: z.coerce.number().int(),
});
const createContractSchema = baseContractSchema;
const editContractSchema = baseContractSchema.partial();

interface ContractFormProps {
  variant: 'create' | 'edit';
  initialData?: Contract;
}

const ContractForm: FC<ContractFormProps> = ({ variant, initialData }) => {
  const axios = useAxiosPrivate();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { id: startupId, contract_id: contractId } = useParams();

  // Forms
  const createForm = useForm<z.infer<typeof baseContractSchema>>({
    resolver: zodResolver(createContractSchema),
    defaultValues: {
      startup_id: parseInt(startupId as string),
    },
  });
  const editForm = useForm<z.infer<typeof baseContractSchema>>({
    resolver: zodResolver(editContractSchema),
    defaultValues: {
      ...initialData,
      total_funding: Number(initialData?.total_funding),
      convertible_note: Number(initialData?.convertible_note),
    },
  });

  const onSubmitCreate = async (data: z.infer<typeof createContractSchema>) => {
    try {
      setIsLoading(true);

      await axios.post<Contract>('/contract', {
        ...data,
        signed_pks_date: dayjs(data.signed_pks_date)
          .add(1, 'day')
          .toISOString(),
        closing_bak_date: dayjs(data.closing_bak_date)
          .add(1, 'day')
          .toISOString(),
      });

      toast.success('Contract created successfully');
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

  const onSubmitEdit = async (data: z.infer<typeof editContractSchema>) => {
    try {
      setIsLoading(true);

      await axios.patch<Contract>(`/contract/${contractId}`, data);

      if (data.signed_pks_date?.toISOString() !== initialData?.signed_pks_date) {
        await axios.patch<Contract>(`/contract/${contractId}`, {
          signed_pks_date: dayjs(data.signed_pks_date)
            .add(1, 'day')
            .toISOString(),
        });
      }

      if (data.closing_bak_date?.toISOString() !== initialData?.closing_bak_date) {
        await axios.patch<Contract>(`/contract/${contractId}`, {
          closing_bak_date: dayjs(data.closing_bak_date)
            .add(1, 'day')
            .toISOString(),
        });
      }

      toast.success('Contract updated successfully');
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
            title='Create Contract'
            description='Create new contract data.'
          />
        ) : (
          <Heading
            title='Edit Contract'
            description='Edit existing contract data.'
          />
        )}
        <Separator className='mt-4 lg:mt-0' />
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
          <div className='flex flex-col lg:w-1/2 gap-4'>
            <FormField
              control={form.control}
              name='pks_number'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>PKS Number</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='signed_pks_date'
              render={({ field }) => (
                <FormItem className='flex flex-col'>
                  <FormLabel>Signed PKS Date</FormLabel>
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
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='closing_bak_date'
              render={({ field }) => (
                <FormItem className='flex flex-col'>
                  <FormLabel>Closing BAK Date</FormLabel>
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
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='total_funding'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Total Funding (IDR)</FormLabel>
                  <FormControl>
                    <Input type='number' {...field} />
                  </FormControl>
                  <FormDescription>The total funding in IDR.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='convertible_note'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Convertible Note</FormLabel>
                  <FormControl>
                    <Input type='number' {...field} />
                  </FormControl>
                  <FormDescription>
                    The convertible note percentage in decimal.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='convertible_note_year'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Convertible Note Year</FormLabel>
                  <FormControl>
                    <Input {...field} type='number' />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='convertible_note_months'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Convertible Note Age</FormLabel>
                  <FormControl>
                    <Input {...field} type='number' />
                  </FormControl>
                  <FormDescription>
                    The convertible note age in months.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='convertible_note_status'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Convertible Note Status</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={initialData?.convertible_note_status}
                  >
                    <FormControl>
                      <SelectTrigger>
                        {initialData?.convertible_note_status ? (
                          <SelectValue
                            placeholder={enumReplacer(
                              initialData?.convertible_note_status
                            )}
                          />
                        ) : (
                          <SelectValue placeholder='Select convertible note status' />
                        )}
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {contractStatusOptions.map((option) => (
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
          </div>
          <Button type='submit' disabled={isLoading}>
            Submit
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default ContractForm;
