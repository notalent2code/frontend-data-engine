'use client';

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/Popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/Select';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/Command';
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
import { cn } from '@/lib/utils';
import { AxiosError } from 'axios';
import toast from 'react-hot-toast';
import { enumReplacer } from '@/util';
import { useForm } from 'react-hook-form';
import { FC, useEffect, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { useDebounce } from '@uidotdev/usehooks';
import { Heading } from '@/components/ui/Heading';
import { Textarea } from '@/components/ui/TextArea';
import { zodResolver } from '@hookform/resolvers/zod';
import { Separator } from '@/components/ui/Separator';
import { useParams, useRouter } from 'next/navigation';
import useAxiosPrivate from '@/hooks/use-axios-private';
import { CaretSortIcon, CheckIcon } from '@radix-ui/react-icons';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { StartupToInvestSchema } from '@/../prisma/generated/zod';
import { InvestmentProgress, Startup, StartupToInvest } from '@prisma/client';

const baseStartupToInvestSchema = StartupToInvestSchema.pick({
  startup_id: true,
  investor_id: true,
  progress: true,
  detail: true,
});
const createStartupToInvestSchema = baseStartupToInvestSchema;
const editStartupToInvestSchema = baseStartupToInvestSchema.partial();

// Startup dropdown
type StartupDropdown = {
  label: string;
  value: number;
};

const startupMapping = (startups: Startup[]): StartupDropdown[] => {
  return startups.map((startup) => ({
    value: startup.id,
    label: startup.name,
  }));
};

interface StartupToInvestFormProps {
  variant: 'create' | 'edit';
  initialData?: StartupToInvest;
}

const StartupToInvestForm: FC<StartupToInvestFormProps> = ({
  variant,
  initialData,
}) => {
  const axios = useAxiosPrivate();
  const router = useRouter();
  const { id: investorId, sti_id: startupToInvestId } = useParams();
  const queryClient = useQueryClient();
  const [startups, setStartups] = useState<StartupDropdown[]>([]);
  const [search, setSearch] = useState<string>('');
  const debounceSearch = useDebounce(search, 300);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  // Startup dropdown
  const fetchStartups = async () => {
    const { data: result } = await axios.get(
      `/startups?search=${debounceSearch}`
    );
    const startups = result.data as Startup[];
    setStartups(startupMapping(startups));
  };

  const { isLoading } = useQuery({
    queryKey: ['startups', debounceSearch],
    queryFn: fetchStartups,
  });

  useEffect(() => {
    queryClient.invalidateQueries({
      queryKey: ['startups', debounceSearch],
    });
  }, [debounceSearch, queryClient]);

  // Forms
  const createForm = useForm<z.infer<typeof baseStartupToInvestSchema>>({
    resolver: zodResolver(createStartupToInvestSchema),
    defaultValues: {
      investor_id: investorId as string,
    },
  });
  const editForm = useForm<z.infer<typeof baseStartupToInvestSchema>>({
    resolver: zodResolver(editStartupToInvestSchema),
    defaultValues: {
      investor_id: investorId as string,
    },
  });

  const onSubmitCreate = async (
    data: z.infer<typeof createStartupToInvestSchema>
  ) => {
    try {
      await axios.post('/startup-to-invest', data);
      toast.success('Successfully created startup to invest!');
      router.push(`/dashboard/venture-capital/${investorId}`);
    } catch (error: any) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message);
      } else {
        toast.error('Something went wrong!');
      }
    }
  };

  const onSubmitEdit = async (
    data: z.infer<typeof editStartupToInvestSchema>
  ) => {
    try {
      await axios.patch(`/startup-to-invest/${startupToInvestId}`, data);
      toast.success('Successfully updated startup to invest!');
      router.push(`/dashboard/venture-capital/${investorId}`);
    } catch (error: any) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message);
      } else {
        toast.error('Something went wrong!');
      }
    }
  };

  const form = variant === 'create' ? createForm : editForm;
  const onSubmit = variant === 'create' ? onSubmitCreate : onSubmitEdit;

  return (
    <div>
      <div className='pb-4'>
        {variant === 'create' ? (
          <Heading
            title='Create Startup to Invest'
            description='Create new startup to invest data.'
          />
        ) : (
          <Heading
            title='Edit Startup to Invest'
            description='Edit startup to invest data.'
          />
        )}
        <Separator className='mt-4 lg:mt-0' />
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
          <div className='flex flex-col w-1/2 gap-4'>
            {variant === 'create' && (
              <FormField
                control={form.control}
                name='startup_id'
                render={({ field }) => (
                  <FormItem className='flex flex-col'>
                    <FormLabel>Startup</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant='outline'
                            role='combobox'
                            className={cn(
                              'w-[250px] justify-between',
                              !field.value && 'text-muted-foreground'
                            )}
                          >
                            {field.value
                              ? startups.find(
                                  (startup) => startup.value === field.value
                                )?.label
                              : initialData?.startup_id || 'Select startup'}
                            <CaretSortIcon className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className='w-[200px] p-0'>
                        <Command>
                          <CommandInput
                            placeholder='Search startup...'
                            className='h-9'
                            onChangeCapture={handleSearchChange}
                          />
                          {isLoading ? (
                            <CommandEmpty className='py-6 text-center text-sm'>
                              Loading...
                            </CommandEmpty>
                          ) : (
                            <CommandEmpty className='py-6 text-center text-sm'>
                              No startup found.
                            </CommandEmpty>
                          )}
                          <CommandGroup>
                            {startups.map((startup) => (
                              <CommandItem
                                value={startup.label}
                                key={startup.value}
                                onSelect={() => {
                                  form.setValue('startup_id', startup.value);
                                }}
                              >
                                {startup.label}
                                <CheckIcon
                                  className={cn(
                                    'ml-auto h-4 w-4',
                                    startup.value === field.value
                                      ? 'opacity-100'
                                      : 'opacity-0'
                                  )}
                                />
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    <FormDescription>
                      Select startup to associate with this startup to invest
                      data.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
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
                          <SelectValue placeholder='Select Progress' />
                        )}
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={InvestmentProgress.STOP_NOT_INTEREST}>
                        {enumReplacer(InvestmentProgress.STOP_NOT_INTEREST)}
                      </SelectItem>
                      <SelectItem
                        value={InvestmentProgress.DUE_DILIGENCE_DATAROOM}
                      >
                        {enumReplacer(
                          InvestmentProgress.DUE_DILIGENCE_DATAROOM
                        )}
                      </SelectItem>
                      <SelectItem value={InvestmentProgress.INTRO}>
                        {enumReplacer(InvestmentProgress.INTRO)}
                      </SelectItem>
                      <SelectItem value={InvestmentProgress.FOLLOW_UP_MEETING}>
                        {enumReplacer(InvestmentProgress.FOLLOW_UP_MEETING)}
                      </SelectItem>
                      <SelectItem value={InvestmentProgress.OFFERING}>
                        {enumReplacer(InvestmentProgress.OFFERING)}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='detail'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Detail</FormLabel>
                  <FormControl>
                    <Textarea {...field} defaultValue={initialData?.detail} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button type='submit'>Submit</Button>
        </form>
      </Form>
    </div>
  );
};

export default StartupToInvestForm;
