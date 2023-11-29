import { FC } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Service } from '@prisma/client';
import { BadgePercent } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Heading } from '@/components/ui/Heading';
import { Separator } from '@/components/ui/Separator';
import { buttonVariants } from '@/components/ui/Button';

interface ServiceProps {
  data: Service[] | null;
  addUrl: string;
  editUrl: string;
}

const Service: FC<ServiceProps> = ({ data, addUrl, editUrl }) => {
  return (
    <div className='flex flex-col gap-2'>
      <div className='py-4'>
        <div className='flex flex-col pt-16 lg:pt-0 lg:flex-row items-start lg:items-center justify-between'>
          <Heading
            title='Service'
            description="Startup detail information about services they provides and it's revenue percentage."
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
        <div className='flex flex-row gap-4'>
          {data.map((service) => (
            <Card
              key={service.id}
              className='flex flex-row items-center justify-start text-sm gap-2 p-4'
            >
              <span className='font-bold'>{service.title}</span>
              <BadgePercent className='w-4 h-4' />
              {service.revenue_percentage} %
            </Card>
          ))}
        </div>
      ) : (
        <p className='text-sm text-muted-foreground py-2'>
          No service data found.
        </p>
      )}
    </div>
  );
};

export default Service;
