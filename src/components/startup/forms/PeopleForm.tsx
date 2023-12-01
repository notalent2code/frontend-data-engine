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
import {
  peopleJobTitleOptions,
} from '@/types';
import * as z from 'zod';
import Image from 'next/image';
import { AxiosError } from 'axios';
import { enumReplacer } from '@/util';
import { toast } from 'react-hot-toast';
import { FC, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useParams, useRouter } from 'next/navigation';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Heading } from '@/components/ui/Heading';
import { People } from '@prisma/client';
import { zodResolver } from '@hookform/resolvers/zod';
import { Separator } from '@/components/ui/Separator';
import useAxiosPrivate from '@/hooks/use-axios-private';
import { PeopleSchema } from '@/../prisma/generated/zod';
import { ACCEPTED_IMAGE_TYPES, MAX_FILE_SIZE } from '@/constants';
import { getImageData } from '@/util';

// Form schema
const basePeopleSchema = PeopleSchema.pick({
  job_title: true,
}).extend({
  startup_id: z.coerce.number().int(),
  name: z.string(),
  phone_number: z.string(),
  email: z.string(),
  privy_id: z.string().optional(),
  linkedin_url: z.string().optional(),
  photo: z
    .instanceof(File)
    .refine((file) => file.size <= MAX_FILE_SIZE, {
      message: `File size must be less than ${MAX_FILE_SIZE / 1024 / 1024} MB`,
    })
    .refine((file) => ACCEPTED_IMAGE_TYPES.includes(file.type), {
      message: `File type must be one of ${ACCEPTED_IMAGE_TYPES.join(', ')}`,
    }),
});
const createPeopleSchema = basePeopleSchema;
const editPeopleSchema = basePeopleSchema.partial();

interface PeopleFormProps {
  variant: 'create' | 'edit';
  initialData?: People;
}

const PeopleForm: FC<PeopleFormProps> = ({ variant, initialData }) => {
  const axios = useAxiosPrivate();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [preview, setPreview] = useState<string>('');
  const { id: startupId, person_id: personId } = useParams();

  // Forms
  const createForm = useForm<z.infer<typeof basePeopleSchema>>({
    resolver: zodResolver(createPeopleSchema),
    defaultValues: {
      startup_id: parseInt(startupId as string),
    },
  });
  const editForm = useForm<z.infer<typeof basePeopleSchema>>({
    resolver: zodResolver(editPeopleSchema),
    defaultValues: {
      ...initialData,
      phone_number: initialData?.phone_number as string,
      email: initialData?.email as string,
      privy_id: initialData?.privy_id as string,
      linkedin_url: initialData?.linkedin_url as string,
    },
  });

  const onSubmitCreate = async (data: z.infer<typeof createPeopleSchema>) => {
    try {
      setIsLoading(true);

      const { data: result } = await axios.post<People>('/people', data);

      if (result) {
        const formData = new FormData();
        formData.append('people_id', result.id);
        formData.append('photo', data.photo);

        await axios.patch('/upload/people', formData);
      }

      toast.success('Person created successfully');
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

  const onSubmitEdit = async (data: z.infer<typeof editPeopleSchema>) => {
    try {
      setIsLoading(true);

      const { data: result } = await axios.patch<People>(
        `/people/${personId}`,
        data
      );

      if (result && data.photo) {
        const formData = new FormData();
        formData.append('people_id', result.id);
        formData.append('photo', data.photo);

        await axios.patch('/upload/people', formData);
      }

      toast.success('Person updated successfully');
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
            title='Create Person'
            description='Create new person data.'
          />
        ) : (
          <Heading
            title='Edit Person'
            description='Edit existing person data.'
          />
        )}
        <Separator className='mt-4 lg:mt-0' />
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
          <div className='flex flex-col w-1/2 gap-4'>
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='phone_number'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input type='number' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='job_title'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Job Title</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={initialData?.job_title}
                  >
                    <FormControl>
                      <SelectTrigger>
                        {initialData?.job_title ? (
                          <SelectValue
                            placeholder={enumReplacer(initialData?.job_title)}
                          />
                        ) : (
                          <SelectValue placeholder='Select job title' />
                        )}
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {peopleJobTitleOptions.map((option) => (
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
              name='privy_id'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Privy ID</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='linkedin_url'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>LinkedIn URL</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className='flex flex-row gap-4 items-center py-2'>
              {preview || initialData?.photo_url ? (
                <Image
                  src={preview || initialData?.photo_url!}
                  width={80}
                  height={80}
                  alt={'photo' || initialData?.name}
                />
              ) : (
                <div className='w-20 h-20 flex justify-center items-center bg-gray-200 rounded-md outline-dashed outline-gray-400'>
                  <p className='text-3xl text-gray-400'>?</p>
                </div>
              )}
              <FormField
                control={form.control}
                name='photo'
                // eslint-disable-next-line no-unused-vars
                render={({ field: { onChange, value, ...rest } }) => (
                  <FormItem>
                    <FormLabel>Person Photo</FormLabel>
                    <FormControl>
                      <Input
                        {...rest}
                        type='file'
                        onChange={(event) => {
                          const { file, displayUrl } = getImageData(event);
                          setPreview(displayUrl);
                          onChange(file);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <Button type='submit' disabled={isLoading}>
            Submit
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default PeopleForm;
