'use client';

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/Popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/Command';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/Select';
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
  InstrumentTypeSchema,
  InvestmentStageSchema,
  InvestmentSyndicationSchema,
  InvestorClassificationSchema,
} from '@/../prisma/generated/zod';

import * as z from 'zod';
import { cn } from '@/lib/utils';
import { AxiosError } from 'axios';
import { toast } from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/Input';
import { FC, useEffect, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { useDebounce } from '@uidotdev/usehooks';
import { Heading } from '@/components/ui/Heading';
import { Checkbox } from '@/components/ui/Checkbox';
import { Textarea } from '@/components/ui/TextArea';
import { zodResolver } from '@hookform/resolvers/zod';
import { Separator } from '@/components/ui/Separator';
import useAxiosPrivate from '@/hooks/use-axios-private';
import { CaretSortIcon, CheckIcon } from '@radix-ui/react-icons';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { InvestmentStage, Investor, User } from '@prisma/client';
import { createCommaSeparatedArray, enumReplacer } from '@/util';

// Form schema
const baseInvestorSchema = z.object({
  user_id: z.string().optional(),
  name: z.string(),
  appetites: z.string(),
  instrument_type: InstrumentTypeSchema,
  investment_stage: InvestmentStageSchema.array().refine(
    (value) => value.some((item) => item),
    {
      message: 'You have to select at least one item.',
    }
  ),
  investment_syndication: InvestmentSyndicationSchema,
  investor_classification: InvestorClassificationSchema,
  focused_sectors: z.string(),
  remarks: z.string(),
  ticket_size_min: z.string(),
  ticket_size_max: z.string(),
});
const createInvestorSchema = baseInvestorSchema;
const editInvestorSchema = baseInvestorSchema.partial();

const investmentStageOptions = Object.values(InvestmentStage);
const investmentStageCheckbox = investmentStageOptions.map((value) => ({
  value,
  label: enumReplacer(value),
}));

// Users dropdown
type UserDropdown = {
  label: string;
  value: string;
};

const userMapping = (users: User[]): UserDropdown[] => {
  return users.map((user) => ({
    value: user.id,
    label: `${user.first_name} ${user.last_name}`,
  }));
};

interface InvestorFormProps {
  variant: 'create' | 'edit';
  initialData?: Investor;
}

const InvestorForm: FC<InvestorFormProps> = ({ variant, initialData }) => {
  const axios = useAxiosPrivate();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [users, setUsers] = useState<UserDropdown[]>([]);
  const [search, setSearch] = useState<string>('');
  const debounceSearch = useDebounce(search, 300);

  // Users dropdown
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const fetchUsers = async () => {
    const { data: result } = await axios.get(`/users?search=${debounceSearch}`);
    const users = result.data as User[];
    setUsers(userMapping(users));
  };

  const { isLoading } = useQuery({
    queryKey: ['users', debounceSearch],
    queryFn: fetchUsers,
  });

  useEffect(() => {
    queryClient.invalidateQueries({
      queryKey: ['users', debounceSearch],
    });
  }, [debounceSearch, queryClient]);

  // Forms
  const createForm = useForm<z.infer<typeof baseInvestorSchema>>({
    resolver: zodResolver(createInvestorSchema),
    defaultValues: {
      investment_stage: [],
    },
  });
  const editForm = useForm<z.infer<typeof baseInvestorSchema>>({
    resolver: zodResolver(editInvestorSchema),
    defaultValues: {
      investment_stage: initialData?.investment_stage,
    },
  });

  const onSubmitCreate = async (data: z.infer<typeof createInvestorSchema>) => {
    try {
      const focused_sectors = createCommaSeparatedArray(data.focused_sectors);
      const { data: result } = await axios.post('/investor', {
        ...data,
        focused_sectors,
      });

      toast.success('Investor created successfully!');
      router.push(`/dashboard/venture-capital/${result.id}`);
    } catch (error: any) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message);
      } else {
        toast.error('Something went wrong!');
      }
    }
  };

  const onSubmitEdit = async (data: z.infer<typeof editInvestorSchema>) => {
    try {
      let focused_sectors: string[] | undefined;
      if (data.focused_sectors) {
        focused_sectors = createCommaSeparatedArray(data.focused_sectors);
      }

      await axios.patch(`/investor/${initialData?.id}`, {
        ...data,
        focused_sectors,
      });

      toast.success('Investor edited successfully!');
      router.back();
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
            title='Create Investor'
            description='Create new investor data.'
          />
        ) : (
          <Heading
            title='Edit Investor'
            description='Edit existing investor data.'
          />
        )}
        <Separator className='mt-4 lg:mt-0' />
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
          <div className='flex flex-col w-1/2 gap-4'>
            <FormField
              control={form.control}
              name='user_id'
              render={({ field }) => (
                <FormItem className='flex flex-col'>
                  <FormLabel>User</FormLabel>
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
                            ? users.find((user) => user.value === field.value)
                                ?.label
                            : initialData?.user_id || 'Select user'}
                          <CaretSortIcon className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className='w-[200px] p-0'>
                      <Command>
                        <CommandInput
                          placeholder='Search user...'
                          className='h-9'
                          onChangeCapture={handleSearchChange}
                        />
                        {isLoading ? (
                          <CommandEmpty className='py-6 text-center text-sm'>
                            Loading...
                          </CommandEmpty>
                        ) : (
                          <CommandEmpty className='py-6 text-center text-sm'>
                            No user found.
                          </CommandEmpty>
                        )}
                        <CommandGroup>
                          {users.map((user) => (
                            <CommandItem
                              value={user.label}
                              key={user.value}
                              onSelect={() => {
                                form.setValue('user_id', user.value);
                              }}
                            >
                              {user.label}
                              <CheckIcon
                                className={cn(
                                  'ml-auto h-4 w-4',
                                  user.value === field.value
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
                    Select user to associate with this investor data.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Investor Name</FormLabel>
                  <FormControl>
                    <Input {...field} defaultValue={initialData?.name} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='appetites'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Appetites</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      defaultValue={initialData?.appetites}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='instrument_type'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Instrument Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        {initialData?.instrument_type ? (
                          <SelectValue
                            placeholder={enumReplacer(
                              initialData?.instrument_type
                            )}
                          />
                        ) : (
                          <SelectValue placeholder='Select Instrument Type' />
                        )}
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value='CN'>CN</SelectItem>
                      <SelectItem value='EQUITY'>EQUITY</SelectItem>
                      <SelectItem value='CN_EQUITY'>CN EQUITY</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='investment_stage'
              render={() => (
                <FormItem>
                  <FormLabel>Investment Stage</FormLabel>
                  {investmentStageCheckbox.map((item) => (
                    <FormField
                      key={item.value}
                      control={form.control}
                      name='investment_stage'
                      render={({ field }) => {
                        // Determine if the current item should be checked
                        const isChecked = field.value?.includes(item.value);

                        return (
                          <FormItem
                            key={item.value}
                            className='flex flex-row items-start space-x-3 space-y-0'
                          >
                            <FormControl>
                              <Checkbox
                                {...field}
                                value={item.value}
                                checked={
                                  isChecked
                                    ? true
                                    : field.value?.includes(item.value)
                                }
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    field.onChange([
                                      ...(field.value || []),
                                      item.value,
                                    ]);
                                  } else {
                                    field.onChange(
                                      (field.value || []).filter(
                                        (value) => value !== item.value
                                      )
                                    );
                                  }
                                }}
                              />
                            </FormControl>
                            <FormLabel className='font-normal'>
                              {item.label}
                            </FormLabel>
                          </FormItem>
                        );
                      }}
                    />
                  ))}
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='investment_syndication'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Investment Syndication</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={initialData?.investment_syndication}
                  >
                    <FormControl>
                      <SelectTrigger>
                        {initialData?.investment_syndication ? (
                          <SelectValue
                            placeholder={enumReplacer(
                              initialData?.investment_syndication
                            )}
                          />
                        ) : (
                          <SelectValue placeholder='Select Investment Syndication' />
                        )}
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value='FOLLOW'>FOLLOW</SelectItem>
                      <SelectItem value='LEAD'>LEAD</SelectItem>
                      <SelectItem value='DOMINANT_FOLLOW'>
                        DOMINANT FOLLOW
                      </SelectItem>
                      <SelectItem value='DOMINANT_LEAD'>
                        DOMINANT LEAD
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='investor_classification'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Investor Classification</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={initialData?.investor_classification}
                  >
                    <FormControl>
                      <SelectTrigger>
                        {initialData?.investor_classification ? (
                          <SelectValue
                            placeholder={enumReplacer(
                              initialData?.investor_classification
                            )}
                          />
                        ) : (
                          <SelectValue placeholder='Select Investor Classification' />
                        )}
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value='MAINSTREAM_AGNOSTIC'>
                        MAINSTREAM AGNOSTIC
                      </SelectItem>
                      <SelectItem value='SPECIFIC_SECTOR'>
                        SPECIFIC SECTOR
                      </SelectItem>
                      <SelectItem value='IMPACT_INVESTMENT'>
                        IMPACT INVESTMENT
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='focused_sectors'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Focused Sectors</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder='FINTECH,BIG DATA,GAMES,AGRICULTURE'
                      defaultValue={initialData?.focused_sectors}
                    />
                  </FormControl>
                  <FormDescription>
                    Separate each sector with a comma without space.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='remarks'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Remarks</FormLabel>
                  <FormControl>
                    <Textarea {...field} defaultValue={initialData?.remarks} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='ticket_size_min'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ticket Size Min</FormLabel>
                  <FormControl>
                    <Input
                      type='number'
                      {...field}
                      defaultValue={Number(initialData?.ticket_size_min) || ''}
                    />
                  </FormControl>
                  <FormDescription>Minimum ticket size in USD.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='ticket_size_max'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ticket Size Max</FormLabel>
                  <FormControl>
                    <Input
                      type='number'
                      {...field}
                      defaultValue={
                        initialData?.ticket_size_max.toString() || ''
                      }
                    />
                  </FormControl>
                  <FormDescription>Maximum ticket size in USD.</FormDescription>
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

export default InvestorForm;
