import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/AlertDialog';
import { FC } from 'react';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/Button';

interface DeleteAlertDialogProps extends React.HTMLAttributes<HTMLDivElement> {
  deleteFn: () => void;
}

const DeleteAlertDialog: FC<DeleteAlertDialogProps> = ({ deleteFn }) => {
  return (
    <div className={cn(buttonVariants({ size: 'lg' }))}>
      <AlertDialog>
        <AlertDialogTrigger>Delete</AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              Please be aware that this action is irreversible. Once completed,
              the data will be permanently erased and cannot be retrieved.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => deleteFn()}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default DeleteAlertDialog;
