import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { cn } from '@/lib/utils';
import { Alumni } from '@prisma/client';
import Link from 'next/link';
import { FC } from 'react';
import { buttonVariants } from '@/components/ui/Button';
import { Separator } from '@/components/ui/Separator';
import { enumReplacer } from '@/util';
import { Badge } from '@/components/ui/Badge';
import { Check, X } from 'lucide-react';

interface AlumniProps {
  data: Alumni | null;
  addUrl: string;
  editUrl: string;
}

const Alumni: FC<AlumniProps> = ({ data, addUrl, editUrl }) => {
  return (
    <Card>
      <CardHeader className='flex flex-row items-center justify-between p-4'>
        <CardTitle>
          <h2 className='text-xl font-bold pt-2'>Alumni</h2>
        </CardTitle>
        {data ? (
          <Link
            href={editUrl + '/alumni'}
            className={cn(
              buttonVariants({ size: 'lg' }),
              'bg-tertiary hover:bg-tertiary hover:opacity-90'
            )}
          >
            Edit
          </Link>
        ) : (
          <Link
            href={addUrl + '/alumni'}
            className={cn(buttonVariants({ size: 'lg' }))}
          >
            Add new
          </Link>
        )}
      </CardHeader>
      <Separator />
      <CardContent className='py-4 px-4 text-sm'>
        {data ? (
          <div className='grid grid-cols-2 lg:grid-cols-4 gap-4'>
            <Badge
              className='flex flex-col p-2 h-full bg-white
                      hover:bg-white outline outline-tertiary text-muted-foreground'
            >
              <span className='pb-2 text-center'>Cluster</span>
              <p className='font-bold text-center'>{data.cluster}</p>
            </Badge>
            <Badge
              className='flex flex-col p-2 h-full bg-white
                      hover:bg-white outline outline-tertiary text-muted-foreground'
            >
              <span className='pb-2 text-center'>Product Cluster</span>
              <p className='font-bold text-center'>
                {enumReplacer(data.product_cluster)}
              </p>
            </Badge>
            <Badge
              className='flex flex-col p-2 h-full bg-white
                      hover:bg-white outline outline-tertiary text-muted-foreground'
            >
              <span className='pb-2 text-center'>Industry Cluster</span>
              <p className='font-bold text-center'>
                {enumReplacer(data.industry_cluster)}
              </p>
            </Badge>
            <Badge
              className='flex flex-col p-2 h-full bg-white
                      hover:bg-white outline outline-tertiary text-muted-foreground'
            >
              <span className='pb-2 text-center'>Current Funding Stage</span>
              <p className='font-bold text-center'>
                {enumReplacer(data.current_funding_stage)}
              </p>
            </Badge>
            <Badge
              className='flex flex-col p-2 h-full bg-white
                      hover:bg-white outline outline-tertiary text-muted-foreground'
            >
              <span className='pb-2 text-center'>
                Product Stopped <br /> or Halt
              </span>
              <p className='font-bold text-center'>
                {data.is_product_stopped_or_vacuum ? (
                  <Check className=' text-white text-xs bg-green-500 rounded-full p-1' />
                ) : (
                  <X className=' text-white text-xs bg-red-500 rounded-full p-1' />
                )}
              </p>
            </Badge>
            <Badge
              className='flex flex-col p-2 h-full bg-white
                      hover:bg-white outline outline-tertiary text-muted-foreground'
            >
              <span className='pb-2 text-center'>
                Product Active <br /> But Stagnant
              </span>
              <p className='font-bold text-center'>
                {data.is_product_active_but_not_developed ? (
                  <Check className=' text-white text-xs bg-green-500 rounded-full p-1' />
                ) : (
                  <X className=' text-white text-xs bg-red-500 rounded-full p-1' />
                )}
              </p>
            </Badge>
            <Badge
              className='flex flex-col p-2 h-full bg-white
                      hover:bg-white outline outline-tertiary text-muted-foreground'
            >
              <span className='pb-2 text-center'>
                Startup <br /> Disband
              </span>
              <p className='font-bold text-center'>
                {data.is_startup_disband ? (
                  <Check className=' text-white text-xs bg-green-500 rounded-full p-1' />
                ) : (
                  <X className=' text-white text-xs bg-red-500 rounded-full p-1' />
                )}
              </p>
            </Badge>
            <Badge
              className='flex flex-col p-2 h-full bg-white
                      hover:bg-white outline outline-tertiary text-muted-foreground'
            >
              <span className='pb-2 text-center'>
                Startup Developed <br />
                Other Product
              </span>
              <p className='font-bold text-center'>
                {data.is_startup_developed_other_product ? (
                  <Check className=' text-white text-xs bg-green-500 rounded-full p-1' />
                ) : (
                  <X className=' text-white text-xs bg-red-500 rounded-full p-1' />
                )}
              </p>
            </Badge>
          </div>
        ) : (
          <p className='text-sm text-muted-foreground'>No alumni data found.</p>
        )}
      </CardContent>
    </Card>
  );
};

export default Alumni;
