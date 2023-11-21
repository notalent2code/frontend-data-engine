import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import { Button } from '@/components/ui/Button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/DropdownMenu';
import { Delete, Edit } from 'lucide-react';
import Link from 'next/link';
import { FC } from 'react';

interface DropdownActionsProps {
  editUrl?: string;
  deleteUrl?: string;
}

const DropdownActions: FC<DropdownActionsProps> = ({ editUrl, deleteUrl }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant='ghost'
          className='flex h-8 w-8 p-0 data-[state=open]:bg-muted'
        >
          <DotsHorizontalIcon className='h-4 w-4' />
          <span className='sr-only'>Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='w-[160px]'>
        {editUrl && (
          <Link href={editUrl}>
            <DropdownMenuItem className='cursor-pointer'>
              <Edit className='h-4 w-4 mr-2' />
              Edit
            </DropdownMenuItem>
          </Link>
        )}
        {deleteUrl && (
          <>
            <DropdownMenuSeparator />
            <Link href={deleteUrl}>
              <DropdownMenuItem className='cursor-pointer'>
                <Delete className='h-4 w-4 mr-2' />
                Delete
              </DropdownMenuItem>
            </Link>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default DropdownActions;
