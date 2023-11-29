import { FC } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Strategic } from '@prisma/client';
import { Card } from '@/components/ui/Card';
import { Heading } from '@/components/ui/Heading';
import { Separator } from '@/components/ui/Separator';
import { buttonVariants } from '@/components/ui/Button';
import { enumReplacer } from '@/util';
import { BarChart2, Briefcase, Users2 } from 'lucide-react';

interface StrategicProps {
  data: Strategic[] | null;
  addUrl: string;
  editUrl: string;
}

const Strategic: FC<StrategicProps> = ({ data, addUrl, editUrl }) => {
  return (
    <div className='flex flex-col gap-2'>
      <div className='pb-4'>
        <div className='flex flex-col pt-16 lg:pt-0 lg:flex-row items-start lg:items-center justify-between'>
          <Heading
            title='Strategic'
            description='Startup detail information about Strategic.'
          />
          <div className='flex gap-4'>
            <Link
              href={addUrl + '/financial-report'}
              className={cn(buttonVariants({ size: 'lg' }))}
            >
              Add new
            </Link>
            {data && data.length > 0 && (
              <Link
                href={editUrl + '/financial-report'}
                className={cn(
                  buttonVariants({ size: 'lg' }),
                  'bg-tertiary hover:bg-tertiary hover:opacity-90 w-full'
                )}
              >
                Edit
              </Link>
            )}
          </div>
        </div>
        <Separator className='mt-4 lg:mt-0' />
      </div>
      {data && data.length > 0 ? (
        <Card className='p-4'>
          {data.map((item) => (
            <div key={item.id}>
              <div className='grid grid-flow-row py-2'>
                <div className='flex flex-row justify-start gap-2'>
                  {item.business_point === 'BUSINESS_MODEL' ? (
                    <Briefcase className='w-6 h-6' color='red' />
                  ) : item.business_point === 'PARTNERSHIP' ? (
                    <Users2 className='w-6 h-6' color='red' />
                  ) : item.business_point === 'TRACTION' ? (
                    <BarChart2 className='w-6 h-6' color='red' />
                  ) : null}
                  <span className='text-lg font-semibold'>
                    {enumReplacer(item.business_point)}
                  </span>
                </div>
                <p>{item.description}</p>
              </div>
            </div>
          ))}
        </Card>
      ) : (
        <p className='text-sm text-muted-foreground py-2'>
          No strategic data found.
        </p>
      )}
    </div>
  );
};

export default Strategic;
