import Link from 'next/link';
import LoginForm from '@/components/auth/LoginForm';
import { Heading } from '@/components/ui/Heading';

const Login = () => {
  return (
    <div className='container mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px]'>
      <div className='flex flex-col'>
        <Heading
          title='Log into your account'
          description='Enter your email and password to continue'
        />
        <p className='text-sm text-muted-foreground'>
          Don&apos;t have an account?{' '}
          <Link
            href='/auth/register'
            className='hover:text-brand text-sm underline underline-offset-4'
          >
            Register
          </Link>
        </p>
      </div>
      <LoginForm />
    </div>
  );
};

export default Login;
