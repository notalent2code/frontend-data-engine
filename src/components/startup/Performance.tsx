import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/Separator';
import { buttonVariants } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import PerformanceAccordion from '@/components/startup/PerformanceAccordion';
import { Performance, Role } from '@prisma/client';
import { FC } from 'react';

interface PerformanceProps {
  role: Role | undefined;
  data: Performance[];
  baseUrl: string;
}

const Performance: FC<PerformanceProps> = ({ role, data, baseUrl }) => {
  return (
    <Card>
      <CardHeader className='flex flex-row items-center justify-between p-4'>
        <CardTitle>
          <h2 className='text-xl font-bold pt-2'>Performance</h2>
        </CardTitle>
        {role === Role.ADMIN && (
          <Link
          href={baseUrl + '/performance/create'}
          className={cn(
            buttonVariants(),
            'bg-tertiary hover:bg-tertiary hover:opacity-90'
          )}
        >
          Add new
        </Link>
        )}
      </CardHeader>
      <Separator />
      {data && data.length > 0 ? (
        <CardContent className='py-0 px-4 text-sm'>
          <PerformanceAccordion data={data} baseUrl={baseUrl} />
        </CardContent>
      ) : (
        <p className='text-sm text-muted-foreground p-4'>
          No performance data found.
        </p>
      )}
    </Card>
  );
};

export default Performance;
