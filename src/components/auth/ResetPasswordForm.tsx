'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Loader } from '@/components/ui/Loader';
import axios from '@/lib/axios';
import { toast } from 'react-hot-toast';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/Form';

const resetPasswordSchema = z
  .object({
    new_password: z.string(),
    confirm_new_password: z.string(),
  })
  .refine((data) => data.new_password === data.confirm_new_password, {
    message: 'Password not match',
    path: ['confirm_password'],
  });

const ResetPasswordForm = () => {
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  const form = useForm<z.infer<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (data: z.infer<typeof resetPasswordSchema>) => {
    try {
      setIsLoading(true);
      // eslint-disable-next-line no-unused-vars
      const { confirm_new_password, ...rest } = data;
      const token = searchParams.get('token');
      const payload = { ...rest, token };
      await axios.post('/auth/reset-password', payload);

      toast.success('Password has been changed successfully!');

      router.push('/auth/login');
    } catch (error: any) {
      toast.error(error.response.data.message);
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
          name='new_password'
          render={({ field }) => (
            <FormItem>
              <FormLabel>New password</FormLabel>
              <FormControl>
                <Input
                  type='password'
                  placeholder='Enter your new password'
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
          name='confirm_new_password'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm new password</FormLabel>
              <FormControl>
                <Input
                  type='password'
                  placeholder='Confirm new password'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type='submit' className='w-50%' disabled={isLoading}>
          Submit
        </Button>
      </form>
    </Form>
  ) : (
    <Loader />
  );
};

export default ResetPasswordForm;
