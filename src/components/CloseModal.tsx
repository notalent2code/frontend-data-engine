'use client';

import { FC } from 'react';
import { X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';

interface CloseModalProps {}

const CloseModal: FC<CloseModalProps> = ({}) => {
  const router = useRouter();

  return (
    <Button
      variant={'ghost'}
      className='h-6 w-6 p-0 rounded-md'
      onClick={() => router.back()}
    >
      <X aria-label='close modal' className='h-4 w-4' />
    </Button>
  );
};

export default CloseModal;
