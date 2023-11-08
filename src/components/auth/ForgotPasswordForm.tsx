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
import { useRouter } from 'next/navigation';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/Form';

const forgotpasswordSchema = z.object({
  email: z.string().email(),
});

const ForgotPasswordForm = () => {
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof forgotpasswordSchema>>({
    resolver: zodResolver(forgotpasswordSchema),
  });

  const onSubmit = async (data: z.infer<typeof forgotpasswordSchema>) => {
    try {
      setIsLoading(true);
      await axios.post('/auth/forgot-password', data);

      toast.success('Please check your email for reset password link.', {
        duration: 7000,
      });

      router.push('/');
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
          name='email'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormDescription>
                Enter your registered email address
              </FormDescription>
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
        <Button type='submit' className='w-50%' disabled={isLoading}>
          Submit
        </Button>
      </form>
    </Form>
  ) : (
    <Loader />
  );
};

export default ForgotPasswordForm;
