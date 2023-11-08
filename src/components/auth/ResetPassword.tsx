import { Heading } from '@/components/ui/Heading';
import ResetPasswordForm from '@/components/auth/ResetPasswordForm';

const ResetPassword = () => {
  return (
    <div className='container mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[500px]'>
      <div className='flex flex-col'>
        <Heading
          title='Create new password'
          description='Enter new password and confirm it.'
        />
      </div>
      <ResetPasswordForm />
    </div>
  );
};

export default ResetPassword;
