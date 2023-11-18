import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/Separator';
import { buttonVariants } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import PerformanceAccordion from '@/components/startup-detail/PerformanceAccordion';
import { Performance } from '@prisma/client';
import { FC } from 'react';

interface PerformanceProps {
  data: Performance[];
  addUrl: string;
  editUrl: string;
}

const Performance: FC<PerformanceProps> = ({ data, addUrl, editUrl }) => {
  return (
    <Card>
      <CardHeader className='flex flex-row items-center justify-between p-4'>
        <CardTitle>
          <h2 className='text-xl font-bold pt-2'>Performance</h2>
        </CardTitle>
        <Link
          href={addUrl + '/performance'}
          className={cn(
            buttonVariants({ size: 'lg' }),
            'bg-tertiary hover:bg-tertiary hover:opacity-90'
          )}
        >
          Add new
        </Link>
      </CardHeader>
      <Separator />
      <CardContent className='py-0 px-4 text-sm'>
        <PerformanceAccordion data={data} editUrl={editUrl} />
      </CardContent>
    </Card>
  );
};

export default Performance;
