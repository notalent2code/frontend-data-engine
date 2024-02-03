'use client';

import {
  File,
  Fingerprint,
  Linkedin,
  Mail,
  Phone,
  UserCircle2,
} from 'lucide-react';
import { FC } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { enumReplacer } from '@/util';
import { People } from '@prisma/client';
import { Heading } from '@/components/ui/Heading';
import { Badge } from '@/components/ui/Badge';
import { Separator } from '@/components/ui/Separator';
import { buttonVariants } from '@/components/ui/Button';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { useAuthStore } from '@/store/auth-store';
import useAxiosPrivate from '@/hooks/use-axios-private';
import toast from 'react-hot-toast';
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

interface PeopleProps {
  data: People[] | null;
  baseUrl: string;
}

const People: FC<PeopleProps> = ({ data, baseUrl }) => {
  const axios = useAxiosPrivate();
  const role = useAuthStore((state) => state.session?.role);

  const deletePerson = async (id: string) => {
    try {
      await axios.delete(`/people/${id}`);
      toast.success('Person deleted successfully!');
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error: any) {
      toast.error('Something went wrong!');
    }
  };

  return (
    <>
      <div className='flex flex-col gap-2'>
        <div className='flex flex-col pt-16 lg:pt-0 lg:flex-row items-start lg:items-center justify-between'>
          <Heading
            title='People'
            description='Great people behind the scene.'
          />
          {role === 'ADMIN' && (
            <Link
              href={baseUrl + '/people/create'}
              className={cn(
                buttonVariants(),
                'bg-tertiary hover:bg-tertiary hover:opacity-90'
              )}
            >
              Add new
            </Link>
          )}
        </div>
        <Separator className='mt-4 lg:mt-0' />
      </div>
      {data && data.length > 0 ? (
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6 py-6 w-full lg:w-fit'>
          {data.map((person) => (
            <Card key={person.id}>
              <CardHeader className='grid grid-flow-row lg:grid-flow-col items-center justify-between'>
                <div className='flex justify-start items-center gap-4'>
                  {person.photo_url ? (
                    <div className='w-20 h-20 overflow-hidden rounded-full'>
                      <Image
                        src={person.photo_url}
                        width={80}
                        height={80}
                        alt={person.name}
                        className='w-full h-full object-cover rounded-full'
                      />
                    </div>
                  ) : (
                    <UserCircle2 width={80} height={80} color='grey' />
                  )}
                  <div>
                    <p>{person.name}</p>
                    <Badge>{enumReplacer(person.job_title)}</Badge>
                  </div>
                </div>
                {role === 'ADMIN' && (
                  <div className='flex flex-row gap-2 pt-4 lg:pt-0'>
                    <Link
                      href={`${baseUrl}/people/${person.id}/edit`}
                      className={cn(
                        buttonVariants({ size: 'sm' }),
                        'bg-tertiary hover:bg-tertiary hover:opacity-90 w-full'
                      )}
                    >
                      Edit
                    </Link>
                    <div className={buttonVariants({ size: 'sm' })}>
                      <AlertDialog>
                        <AlertDialogTrigger>Delete</AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Are you absolutely sure?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              Please be aware that this action is irreversible.
                              Once completed, the data will be permanently
                              erased and cannot be retrieved.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => deletePerson(person.id)}
                            >
                              Continue
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                )}
              </CardHeader>
              <CardContent>
                <div className='pb-4'>
                  <h2 className='font-bold pb-2'>Contact</h2>
                  <div className='flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-start'>
                    {person.email ? (
                      <Link href={`mailto:${person.email}`} target='_blank'>
                        <Card className='flex flex-row items-center justify-start text-sm gap-2 p-2'>
                          <Mail className='w-4 h-4' />
                          {person.email}
                        </Card>
                      </Link>
                    ) : null}
                    {person.phone_number ? (
                      <Link
                        href={`https://wa.me/${person.phone_number}`}
                        target='_blank'
                      >
                        <Card className='flex flex-row items-center justify-start text-sm gap-2 p-2'>
                          <Phone className='w-4 h-4' />
                          {person.phone_number}
                        </Card>
                      </Link>
                    ) : null}
                    {person.qr_code_url ? (
                      <Link href={person.qr_code_url} target='_blank'>
                        <Card className='flex flex-row items-center justify-start text-sm gap-2 p-2'>
                          <File className='w-4 h-4' />
                          QR Code
                        </Card>
                      </Link>
                    ) : null}
                  </div>
                </div>
                <div>
                  <h2 className='font-bold pb-2'>Social</h2>
                  <div className='flex flex-row gap-4 items-center justify-start'>
                    {person.privy_id ? (
                      <Card className='flex flex-row items-center justify-start text-sm gap-2 p-2'>
                        <Fingerprint className='w-4 h-4' />
                        {`Privy ID: ${person.privy_id}`}
                      </Card>
                    ) : null}
                    {person.linkedin_url ? (
                      <Link href={person.linkedin_url} target='_blank'>
                        <Card className='flex flex-row items-center justify-start text-sm gap-2 p-2'>
                          <Linkedin className='w-4 h-4' />
                          LinkedIn
                        </Card>
                      </Link>
                    ) : null}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <p className='text-sm text-muted-foreground py-2'>
          No people data found.
        </p>
      )}
    </>
  );
};

export default People;
