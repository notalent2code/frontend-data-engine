import Link from 'next/link';
import LoginForm from '@/components/LoginForm';

const Login = () => {
  return (
    <div className='containe mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px]'>
      <div className='flex flex-col space-y-1'>
        <h1 className='text-2xl font-semibold tracking-tight'>
          Log into your account
        </h1>
        <p className='text-sm text-muted-foreground'>
          Enter your email and password to continue.
        </p>
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
