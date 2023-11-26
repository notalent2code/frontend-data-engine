'use client';

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
import { FC } from 'react';
import { AxiosError } from 'axios';
import { toast } from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Heading } from '@/components/ui/Heading';
import { Checkbox } from '@/components/ui/Checkbox';
import { Textarea } from '@/components/ui/TextArea';
import { zodResolver } from '@hookform/resolvers/zod';
import { Separator } from '@/components/ui/Separator';
import useAxiosPrivate from '@/hooks/use-axios-private';
import { InvestmentStage, Investor } from '@prisma/client';
import { createCommaSeparatedArray, enumReplacer } from '@/util';

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
  ticket_size_min: z.coerce.number(),
  ticket_size_max: z.coerce.number(),
});
const createInvestorSchema = baseInvestorSchema;
const editInvestorSchema = baseInvestorSchema.partial();

const investmentStageOptions = Object.values(InvestmentStage);
const investmentStageCheckbox = investmentStageOptions.map((value) => ({
  value,
  label: enumReplacer(value),
}));

interface InvestorFormProps {
  variant: 'create' | 'edit';
  initialData?: Investor;
}

const InvestorForm: FC<InvestorFormProps> = ({ variant, initialData }) => {
  const axios = useAxiosPrivate();
  const router = useRouter();
  const createForm = useForm<z.infer<typeof baseInvestorSchema>>({
    resolver: zodResolver(createInvestorSchema),
    defaultValues: {
      investment_stage: [],
    },
  });
  const editForm = useForm<z.infer<typeof baseInvestorSchema>>({
    resolver: zodResolver(editInvestorSchema),
    defaultValues: {
      investment_stage: [],
    },
  });

  const onSubmitCreate = async (data: z.infer<typeof createInvestorSchema>) => {
    try {
      const focused_sectors = createCommaSeparatedArray(data.focused_sectors);
      await axios.post('/investor', { ...data, focused_sectors });
      toast.success('Investor created successfully!');
      router.push('/dashboard/venture-capital');
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

      await axios.put(`/investor/${initialData?.id}`, {
        ...data,
        focused_sectors,
      });

      toast.success('Investor editd successfully!');
      router.push('/dashboard/venture-capital');
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

      {variant === 'create' ? (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='space-y-4'
          >
            <div className='flex flex-col w-1/2 gap-4'>
              <FormField
                control={createForm.control}
                name='user_id'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>User ID</FormLabel>
                    <FormControl>
                      {initialData?.user_id ? (
                        <Input
                          autoFocus
                          {...field}
                          defaultValue={initialData?.user_id}
                        />
                      ) : (
                        <Input autoFocus {...field} />
                      )}
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={createForm.control}
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
                control={createForm.control}
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
                control={createForm.control}
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
                control={createForm.control}
                name='investment_stage'
                render={() => (
                  <FormItem>
                    <FormLabel>Investment Stage</FormLabel>
                    {investmentStageCheckbox.map((item) => (
                      <FormField
                        key={item.value}
                        control={createForm.control}
                        name='investment_stage'
                        render={({ field }) => {
                          // Determine if the current item should be checked
                          const isChecked =
                            initialData?.investment_stage.includes(item.value);

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
                control={createForm.control}
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
                control={createForm.control}
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
                control={createForm.control}
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
                control={createForm.control}
                name='remarks'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Remarks</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        defaultValue={initialData?.remarks}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={createForm.control}
                name='ticket_size_min'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ticket Size Min</FormLabel>
                    <FormControl>
                      <Input
                        type='number'
                        {...field}
                        defaultValue={
                          Number(initialData?.ticket_size_min) || ''
                        }
                      />
                    </FormControl>
                    <FormDescription>
                      Minimum ticket size in USD.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={createForm.control}
                name='ticket_size_max'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ticket Size Max</FormLabel>
                    <FormControl>
                      <Input
                        type='number'
                        {...field}
                        defaultValue={
                          Number(initialData?.ticket_size_max) || ''
                        }
                      />
                    </FormControl>
                    <FormDescription>
                      Maximum ticket size in USD.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button type='submit'>Submit</Button>
          </form>
        </Form>
      ) : (
        <Form {...editForm}>
          <form
            onSubmit={editForm.handleSubmit(onSubmitEdit)}
            className='space-y-4'
          >
            <div className='flex flex-col w-1/2 gap-4'>
              <FormField
                control={editForm.control}
                name='user_id'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>User ID</FormLabel>
                    <FormControl>
                      {initialData?.user_id ? (
                        <Input
                          autoFocus
                          {...field}
                          defaultValue={initialData?.user_id}
                        />
                      ) : (
                        <Input autoFocus {...field} />
                      )}
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={editForm.control}
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
                control={editForm.control}
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
                control={editForm.control}
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
                control={editForm.control}
                name='investment_stage'
                render={() => (
                  <FormItem>
                    <FormLabel>Investment Stage</FormLabel>
                    {investmentStageCheckbox.map((item) => (
                      <FormField
                        key={item.value}
                        control={editForm.control}
                        name='investment_stage'
                        render={({ field }) => {
                          // Determine if the current item should be checked
                          const isChecked =
                            initialData?.investment_stage.includes(item.value);

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
                control={editForm.control}
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
                control={editForm.control}
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
                control={editForm.control}
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
                control={editForm.control}
                name='remarks'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Remarks</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        defaultValue={initialData?.remarks}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={editForm.control}
                name='ticket_size_min'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ticket Size Min</FormLabel>
                    <FormControl>
                      <Input
                        type='number'
                        {...field}
                        defaultValue={
                          Number(initialData?.ticket_size_min) || ''
                        }
                      />
                    </FormControl>
                    <FormDescription>
                      Minimum ticket size in USD.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={editForm.control}
                name='ticket_size_max'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ticket Size Max</FormLabel>
                    <FormControl>
                      <Input
                        type='number'
                        {...field}
                        defaultValue={
                          Number(initialData?.ticket_size_max) || ''
                        }
                      />
                    </FormControl>
                    <FormDescription>
                      Maximum ticket size in USD.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button type='submit'>Submit</Button>
          </form>
        </Form>
      )}
    </div>
  );
};

export default InvestorForm;
