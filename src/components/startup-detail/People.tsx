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

interface PeopleProps {
  data: People[] | null;
  addUrl: string;
  editUrl: string;
}

const People: FC<PeopleProps> = ({ data, addUrl, editUrl }) => {
  return (
    <>
      <div className='pb-4'>
        <div className='flex flex-col pt-16 lg:pt-0 lg:flex-row items-start lg:items-center justify-between'>
          <Heading
            title='People'
            description='Great people behind the scene.'
          />
          <Link
            href={addUrl + '/people'}
            className={cn(buttonVariants({ size: 'lg' }))}
          >
            Add new
          </Link>
        </div>
        <Separator className='mt-4 lg:mt-0' />
      </div>
      {data && data.length > 0 ? (
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6 py-6 w-full lg:w-fit'>
          {data.map((person) => (
            <Card key={person.id}>
              <CardHeader className='grid grid-flow-row lg:grid-flow-col items-center justify-between'>
                <div className='w-fit lg:w-80 h-fit flex justify-start items-center gap-4'>
                  {person.photo_url ? (
                    <Image
                      src={person.photo_url}
                      width={80}
                      height={80}
                      alt={person.name}
                    />
                  ) : (
                    <UserCircle2 width={80} height={80} color='grey' />
                  )}
                  <div>
                    <p>{person.name}</p>
                    <Badge>{enumReplacer(person.job_title)}</Badge>
                  </div>
                </div>
                <Link
                  href={editUrl + `/people/${person.id}`}
                  className={cn(
                    buttonVariants({ size: 'sm' }),
                    'bg-tertiary hover:bg-tertiary hover:opacity-90 w-full'
                  )}
                >
                  Edit
                </Link>
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
                          QR Code Link
                        </Card>
                      </Link>
                    ) : null}
                  </div>
                </div>
                <div className=''>
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
        <p className='text-sm text-muted-foreground'>No people data found.</p>
      )}
    </>
  );
};

export default People;
