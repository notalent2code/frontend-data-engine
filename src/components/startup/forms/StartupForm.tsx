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
  startupCategoryOptions,
  StartupDetail,
  startupIntakeOptions,
  startupStageOptions,
  startupStatusOptions,
} from '@/types';
import * as z from 'zod';
import Image from 'next/image';
import { AxiosError } from 'axios';
import Map from '@/components/Map';
import { enumReplacer } from '@/util';
import { toast } from 'react-hot-toast';
import { FC, useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Heading } from '@/components/ui/Heading';
import { Location, Startup } from '@prisma/client';
import { Textarea } from '@/components/ui/TextArea';
import { zodResolver } from '@hookform/resolvers/zod';
import { Separator } from '@/components/ui/Separator';
import useAxiosPrivate from '@/hooks/use-axios-private';
import { StartupSchema } from '@/../prisma/generated/zod';
import { ACCEPTED_IMAGE_TYPES, MAX_FILE_SIZE } from '@/constants';
import { getImageData } from '@/util';

// Form schema
const baseStartupSchema = StartupSchema.omit({
  id: true,
  intake_year: true,
  logo_url: true,
  created_at: true,
  updated_at: true,
}).extend({
  id: z.coerce.number().int().positive(),
  intake_year: z.coerce.number().int().positive(),
  logo: z
    .instanceof(File)
    .refine((file) => file.size <= MAX_FILE_SIZE, {
      message: `File size must be less than ${MAX_FILE_SIZE / 1024 / 1024} MB`,
    })
    .refine((file) => ACCEPTED_IMAGE_TYPES.includes(file.type), {
      message: `File type must be one of ${ACCEPTED_IMAGE_TYPES.join(', ')}`,
    }),
  location: z.object({
    address: z.string(),
    latitude: z.coerce.number(),
    longitude: z.coerce.number(),
  }),
});
const createStartupSchema = baseStartupSchema;
const editStartupSchema = baseStartupSchema.partial().extend({
  location: z.object({
    address: z.string().optional(),
    latitude: z.coerce.number().optional(),
    longitude: z.coerce.number().optional(),
  }),
});

interface StartupFormProps {
  variant: 'create' | 'edit';
  initialData?: StartupDetail;
}

const StartupForm: FC<StartupFormProps> = ({ variant, initialData }) => {
  const axios = useAxiosPrivate();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [preview, setPreview] = useState<string>('');
  const [clickedLatLng, setClickedLatLng] = useState<{
    lat: number | null;
    lng: number | null;
  }>({
    lat: null,
    lng: null,
  });

  // Forms
  const createForm = useForm<z.infer<typeof baseStartupSchema>>({
    resolver: zodResolver(createStartupSchema),
  });
  const editForm = useForm<z.infer<typeof baseStartupSchema>>({
    resolver: zodResolver(editStartupSchema),
  });

  const onSubmitCreate = async (data: z.infer<typeof createStartupSchema>) => {
    try {
      setIsLoading(true);

      const { data: result } = await axios.post<Startup>('/startups', data);

      if (result) {
        const formData = new FormData();
        formData.append('startup_id', result.id.toString());
        formData.append('logo', data.logo);

        await axios.patch('/upload/startups', formData);

        const locationData: Partial<Location> = {
          startup_id: result.id,
          address: data.location.address,
          latitude: data.location.latitude,
          longitude: data.location.longitude,
        };

        await axios.post('/location', locationData);
      }

      toast.success('Startup created successfully!');
      router.push(`/dashboard/startups/${result.id}`);
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

  const onSubmitEdit = async (data: z.infer<typeof editStartupSchema>) => {
    try {
      setIsLoading(true);

      const { data: result } = await axios.patch<Startup>(
        `/startups/${initialData?.id}`,
        data
      );

      if (result && data.logo) {
        const formData = new FormData();
        formData.append('startup_id', result.id.toString());
        formData.append('logo', data.logo);

        await axios.patch('/upload/startups', formData);
      }

      if (result && data.location) {
        const locationData: Partial<Location> = {
          startup_id: result.id,
          address: data.location.address,
          latitude: data.location.latitude,
          longitude: data.location.longitude,
        };

        await axios.patch(
          `/location/${initialData?.Location.id}`,
          locationData
        );
      }

      toast.success('Startup updated successfully!');
      router.push(`/dashboard/startups/${result.id}`);
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

  const handleMapClick = useCallback(
    (latLng: { lat: number; lng: number }) => {
      setClickedLatLng(latLng);
      form.setValue('location.latitude', latLng.lat);
      form.setValue('location.longitude', latLng.lng);
    },
    [form]
  );

  return (
    <div>
      <div className='pb-4'>
        {variant === 'create' ? (
          <Heading
            title='Create Startup'
            description='Create new startup data.'
          />
        ) : (
          <Heading
            title='Edit Startup'
            description='Edit existing startup data.'
          />
        )}
        <Separator className='mt-4 lg:mt-0' />
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
          <div className='flex flex-col w-1/2 gap-4'>
            <FormField
              control={form.control}
              name='id'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Startup ID</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type='number'
                      disabled={variant === 'edit'}
                      defaultValue={initialData?.id}
                    />
                  </FormControl>
                  {variant === 'create' && (
                    <FormDescription>
                      Please double check the provided ID, as it cannot be
                      modified at a later time.
                    </FormDescription>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Startup Name</FormLabel>
                  <FormControl>
                    <Input {...field} defaultValue={initialData?.name} />
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
                    <Textarea
                      {...field}
                      defaultValue={initialData?.description}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='category'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={initialData?.category}
                  >
                    <FormControl>
                      <SelectTrigger>
                        {initialData?.category ? (
                          <SelectValue
                            placeholder={enumReplacer(initialData?.category)}
                          />
                        ) : (
                          <SelectValue placeholder='Select startup category' />
                        )}
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {startupCategoryOptions.map((option) => (
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
              name='latest_stage'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Latest Stage</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={initialData?.latest_stage}
                  >
                    <FormControl>
                      <SelectTrigger>
                        {initialData?.latest_stage ? (
                          <SelectValue
                            placeholder={enumReplacer(
                              initialData?.latest_stage
                            )}
                          />
                        ) : (
                          <SelectValue placeholder='Select startup latest stage' />
                        )}
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {startupStageOptions.map((option) => (
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
              name='status'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={initialData?.status}
                  >
                    <FormControl>
                      <SelectTrigger>
                        {initialData?.status ? (
                          <SelectValue
                            placeholder={enumReplacer(initialData?.status)}
                          />
                        ) : (
                          <SelectValue placeholder='Select startup status' />
                        )}
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {startupStatusOptions.map((option) => (
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
              name='intake_type'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Intake Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={initialData?.intake_type}
                  >
                    <FormControl>
                      <SelectTrigger>
                        {initialData?.intake_type ? (
                          <SelectValue placeholder={initialData?.intake_type} />
                        ) : (
                          <SelectValue placeholder='Select startup intake type' />
                        )}
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {startupIntakeOptions.map((option) => (
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
              name='intake_year'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Intake Year</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type='number'
                      defaultValue={initialData?.intake_year}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='pitchdeck_url'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pitchdeck URL</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      defaultValue={initialData?.pitchdeck_url}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='website_url'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Website URL</FormLabel>
                  <FormControl>
                    <Input {...field} defaultValue={initialData?.website_url} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className='flex flex-row gap-4 items-center py-2'>
              {preview || initialData?.logo_url ? (
                <Image
                  src={preview || initialData?.logo_url!}
                  width={80}
                  height={80}
                  alt={'logo' || initialData?.name}
                />
              ) : (
                <div className='w-20 h-20 flex justify-center items-center bg-gray-200 rounded-md outline-dashed outline-gray-400'>
                  <p className='text-3xl text-gray-400'>?</p>
                </div>
              )}
              <FormField
                control={form.control}
                name='logo'
                // eslint-disable-next-line no-unused-vars
                render={({ field: { onChange, value, ...rest } }) => (
                  <FormItem>
                    <FormLabel>Startup Logo</FormLabel>
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

            <FormField
              control={form.control}
              name='location.address'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Address</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      defaultValue={initialData?.Location.address}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Card className='p-2'>
              <Map
                latitude={
                  clickedLatLng.lat ||
                  initialData?.Location?.latitude ||
                  -6.2302976
                }
                longitude={
                  clickedLatLng.lng ||
                  initialData?.Location?.longitude ||
                  106.8157334
                }
                onMapClick={handleMapClick}
              />
            </Card>
            <FormDescription>
              If Google Maps marker not showing, try to refresh the page.
            </FormDescription>
          </div>
          <Button type='submit' disabled={isLoading}>
            Submit
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default StartupForm;
