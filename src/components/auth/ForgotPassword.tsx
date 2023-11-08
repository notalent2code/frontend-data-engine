import { Heading } from '@/components/ui/Heading';
import ForgotPasswordForm from '@/components/auth/ForgotPasswordForm';

const ForgotPassword = () => {
  return (
    <div className='container mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[500px]'>
      <div className='flex flex-col'>
        <Heading
          title='Reset your password'
          description='We will send you an email with a link to reset your password.
          Please wait for approximately 5 minutes, and kindly check your spam folder if you do not receive the email.' 
        />
      </div>
      <ForgotPasswordForm />
    </div>
  );
};

export default ForgotPassword;
