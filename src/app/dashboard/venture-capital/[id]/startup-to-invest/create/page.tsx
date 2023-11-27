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
import { Startup } from '@prisma/client';
import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { useDebounce } from '@uidotdev/usehooks';
import { zodResolver } from '@hookform/resolvers/zod';
import useAxiosPrivate from '@/hooks/use-axios-private';
import { CaretSortIcon, CheckIcon } from '@radix-ui/react-icons';
import { useQuery, useQueryClient } from '@tanstack/react-query';

const FormSchema = z.object({
  startup: z.number({
    required_error: 'Please select a startup.',
  }),
});

type StartupDropdown = {
  label: string;
  value: number;
};

const mapping = (startups: Startup[]): StartupDropdown[] => {
  return startups.map((startup) => ({
    value: startup.id,
    label: startup.name,
  }));
};

export default function ComboboxForm() {
  const axios = useAxiosPrivate();
  const queryClient = useQueryClient();
  const [startups, setStartups] = useState<StartupDropdown[]>([]);
  const [search, setSearch] = useState<string>('');
  const debounceSearch = useDebounce(search, 300);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const fetchStartups = async () => {
    const { data: result } = await axios.get(
      `/startups?search=${debounceSearch}`
    );
    const startups = result.data as Startup[];
    setStartups(mapping(startups));
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

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    // eslint-disable-next-line no-console
    console.log({
      title: 'You submitted the following values:',
      data,
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
        <FormField
          control={form.control}
          name='startup'
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
                        'w-[200px] justify-between',
                        !field.value && 'text-muted-foreground'
                      )}
                    >
                      {field.value
                        ? startups.find(
                            (startup) => startup.value === field.value
                          )?.label
                        : 'Select startup'}
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
                            form.setValue('startup', startup.value);
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
                This is the startup that will be used in the dashboard.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type='submit'>Submit</Button>
      </form>
    </Form>
  );
}
