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
import { useState } from 'react';
import { AxiosError } from 'axios';
import { User } from '@prisma/client';
import { UserSession } from '@/types';
import { toast } from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Loader } from '@/components/ui/Loader';
import { useQuery } from '@tanstack/react-query';
import { Heading } from '@/components/ui/Heading';
import { useAuthStore } from '@/store/auth-store';
import { zodResolver } from '@hookform/resolvers/zod';
import { Separator } from '@/components/ui/Separator';
import useAxiosPrivate from '@/hooks/use-axios-private';

type UserProfile = Omit<User, 'password' | 'refresh_token'>;

const userProfileSchema = z.object({
  first_name: z.string().optional(),
  last_name: z.string().optional(),
  email: z.string().email().optional(),
  phone_number: z.string().optional(),
});

const Page = () => {
  const axios = useAxiosPrivate();
  const router = useRouter();
  const authStore = useAuthStore();
  const [disabled, setDisabled] = useState<boolean>(true);

  const toggleDisabled = () => {
    setDisabled(!disabled);
  };

  const fetchProfile = async () => {
    try {
      const { data } = await axios.get('/users/profile');
      return data as UserProfile;
    } catch (error: any) {
      toast.error('Failed to fetch user profile');
      router.push('/auth/login');
    }
  };

  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: fetchProfile,
  });

  const form = useForm<z.infer<typeof userProfileSchema>>({
    resolver: zodResolver(userProfileSchema),
  });

  const onSubmit = async (data: z.infer<typeof userProfileSchema>) => {
    try {
      const res = await axios.patch('/users/profile', data);
      toast.success('Profile updated successfully!');
      setDisabled(true);

      if (res.status === 200) {
        authStore.setSession(res.data as UserSession);
      }
    } catch (error: any) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message);
      } else {
        toast.error('Failed to update user profile');
      }
    }
  };

  return isLoading ? (
    <Loader />
  ) : profile ? (
    <div>
      <div className='pb-4'>
        <div className='flex flex-col pt-16 lg:pt-0 lg:flex-row items-start lg:items-center justify-between'>
          <Heading
            title='User Profile'
            description='Update your personal information.'
          />
          <Button onClick={() => toggleDisabled()}>
            {disabled ? 'Edit' : 'Cancel'}
          </Button>
        </div>
        <Separator className='mt-4 lg:mt-0' />
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
          <div className='sm:grid sm:grid-cols-2 sm:gap-4 sm:space-y-0 space-y-4'>
            <FormField
              control={form.control}
              name='first_name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor='first_name'>First Name</FormLabel>
                  <FormControl>
                    <Input
                      autoFocus
                      {...field}
                      defaultValue={profile.first_name}
                      disabled={disabled}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='last_name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor='last_name'>Last Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      defaultValue={profile.last_name}
                      disabled={disabled}
                    />
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
                  <FormLabel htmlFor='email'>Email</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      defaultValue={profile.email}
                      disabled={disabled}
                    />
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
                  <FormLabel htmlFor='phone_number'>Phone Number</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      defaultValue={profile.phone_number}
                      disabled={disabled}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button type='submit' disabled={disabled}>
            Save
          </Button>
        </form>
      </Form>
    </div>
  ) : null;
};

export default Page;
