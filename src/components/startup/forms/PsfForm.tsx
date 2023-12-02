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
import { ProblemSolutionFit } from '@prisma/client';
import { zodResolver } from '@hookform/resolvers/zod';
import { Separator } from '@/components/ui/Separator';
import useAxiosPrivate from '@/hooks/use-axios-private';
import { ProblemSolutionFitSchema } from '@/../prisma/generated/zod';
import { Textarea } from '@/components/ui/TextArea';
import { Input } from '@/components/ui/Input';

// Form schema
const basePsfSchema = ProblemSolutionFitSchema.pick({
  title: true,
  description: true,
}).extend({
  startup_id: z.coerce.number().int(),
});
const createPsfSchema = basePsfSchema;
const editPsfSchema = basePsfSchema.partial();

interface PsfFormProps {
  variant: 'create' | 'edit';
  initialData?: ProblemSolutionFit;
}

const PsfForm: FC<PsfFormProps> = ({ variant, initialData }) => {
  const axios = useAxiosPrivate();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { id: startupId, psf_id: psfId } = useParams();

  // Forms
  const createForm = useForm<z.infer<typeof basePsfSchema>>({
    resolver: zodResolver(createPsfSchema),
    defaultValues: {
      startup_id: parseInt(startupId as string),
    },
  });
  const editForm = useForm<z.infer<typeof basePsfSchema>>({
    resolver: zodResolver(editPsfSchema),
    defaultValues: initialData,
  });

  const onSubmitCreate = async (data: z.infer<typeof createPsfSchema>) => {
    try {
      setIsLoading(true);

      await axios.post('/psf', data);

      toast.success('Problem solution fit created successfully!');
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

  const onSubmitEdit = async (data: z.infer<typeof editPsfSchema>) => {
    try {
      setIsLoading(true);

      await axios.patch(`/psf/${psfId}`, data);

      toast.success('Problem solution fit updated successfully!');
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
            title='Create Problem Solution Fit'
            description='Create new problem solution fit data.'
          />
        ) : (
          <Heading
            title='Edit Problem Solution Fit'
            description='Edit existing problem solution fit data.'
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

export default PsfForm;
