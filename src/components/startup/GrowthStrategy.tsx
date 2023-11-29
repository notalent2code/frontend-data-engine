import { FC } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { GrowthStrategy } from '@prisma/client';
import { Card } from '@/components/ui/Card';
import { Heading } from '@/components/ui/Heading';
import { Separator } from '@/components/ui/Separator';
import { buttonVariants } from '@/components/ui/Button';

interface GrowthStrategyProps {
  data: GrowthStrategy[] | null;
  addUrl: string;
  editUrl: string;
}

const GrowthStrategy: FC<GrowthStrategyProps> = ({ data, addUrl, editUrl }) => {
  return (
    <div className='flex flex-col gap-2'>
      <div className='pb-4'>
        <div className='flex flex-col pt-16 lg:pt-0 lg:flex-row items-start lg:items-center justify-between'>
          <Heading
            title='Growth Strategy'
            description='Startup detail information about growth strategy.'
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
          {data.map((gs) => (
            <Card key={gs.id} className='p-4'>
              <p>{gs.description}</p>
            </Card>
          ))}
        </div>
      ) : (
        <p className='text-sm text-muted-foreground py-2'>
          No growth strategy data found.
        </p>
      )}
    </div>
  );
};

export default GrowthStrategy;
