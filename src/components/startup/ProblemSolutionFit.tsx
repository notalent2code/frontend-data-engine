import { FC } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { ProblemSolutionFit } from '@prisma/client';
import { Card } from '@/components/ui/Card';
import { Heading } from '@/components/ui/Heading';
import { Separator } from '@/components/ui/Separator';
import { buttonVariants } from '@/components/ui/Button';

interface ProblemSolutionFitProps {
  data: ProblemSolutionFit[] | null;
  addUrl: string;
  editUrl: string;
}

const ProblemSolutionFit: FC<ProblemSolutionFitProps> = ({
  data,
  addUrl,
  editUrl,
}) => {
  return (
    <div className='flex flex-col gap-2'>
      <div className='py-4'>
        <div className='flex flex-col pt-16 lg:pt-0 lg:flex-row items-start lg:items-center justify-between'>
          <Heading
            title='Problem Solution Fit'
            description="Startup detail information about service's problem solution fit."
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
          {data.map((psf) => (
            <div
              key={psf.id}
              className='flex flex-row items-start justify-start gap-4'
            >
              <Card className='flex flex-col items-start justify-start gap-2 text-sm p-4'>
                <span className='font-bold'>{psf.title}</span>
                <Separator className='w-full' />
                <p>{psf.description}</p>
              </Card>
            </div>
          ))}
        </div>
      ) : (
        <p className='text-sm text-muted-foreground py-2'>
          No problem solution fit data found.
        </p>
      )}
    </div>
  );
};

export default ProblemSolutionFit;
