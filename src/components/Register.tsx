import Link from 'next/link';
import RegisterForm from '@/components/RegisterForm';
import { Heading } from '@/components/ui/Heading';

const Register = () => {
  return (
    <div
      className='container mx-auto flex w-full flex-col justify-center space-y-6 
      sm:w-[600px]'
    >
      <div className='flex flex-col'>
        <Heading
          title='Register new account'
          description='Create an account to access all features.'
        />
        <p className='text-sm text-muted-foreground'>
          Already have an account?{' '}
          <Link
            href='/login'
            className='hover:text-brand text-sm underline underline-offset-4'
          >
            Login
          </Link>
        </p>
      </div>
      <RegisterForm />
    </div>
  );
};

export default Register;
