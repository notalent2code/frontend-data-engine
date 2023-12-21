'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import Link from 'next/link';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Loader } from '@/components/ui/Loader';
import useAxiosPrivate from '@/hooks/use-axios-private';
import { toast } from 'react-hot-toast';
import { useAuthStore } from '@/store/auth-store';
import { useRouter } from 'next/navigation';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/Form';
import { AxiosError } from 'axios';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

const LoginForm = () => {
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();
  const authStore = useAuthStore();
  const axios = useAxiosPrivate();

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: z.infer<typeof loginSchema>) => {
    try {
      setIsLoading(true);
      const response = await axios.post('/auth/login', data);

      toast.success('Login successful');

      const { access_token, ...user } = response.data;

      authStore.setToken(access_token);
      authStore.setSession(user);
      document.cookie = `isLoggedIn=true; path=/; SameSite=Lax;`;

      if (user.role === 'ADMIN') {
        router.push('/dashboard/analytics');
      } else {
        router.push('/dashboard/startups');
      }
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

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return isMounted ? (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
        <FormField
          control={form.control}
          name='email'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  placeholder='john.doe@example.mail'
                  autoFocus
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='password'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input
                  type='password'
                  placeholder='Enter your password'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className='mt-4 flex flex-row align-middle justify-between items-center col-span-2'>
          <Button type='submit' className='w-50%' disabled={isLoading}>
            Submit
          </Button>
          <p className='text-sm text-muted-foreground'>
            Forgot your password?{' '}
            <Link
              href='/auth/forgot-password'
              className='hover:text-brand text-sm underline underline-offset-4'
            >
              Reset
            </Link>
          </p>
        </div>
      </form>
    </Form>
  ) : (
    <Loader />
  );
};

export default LoginForm;
