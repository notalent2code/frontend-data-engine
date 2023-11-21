import { FC } from 'react';
import Link from 'next/link';
import dayjs from 'dayjs';
import { cn } from '@/lib/utils';
import { Synergy } from '@prisma/client';
import { Card } from '@/components/ui/Card';
import { Heading } from '@/components/ui/Heading';
import { Separator } from '@/components/ui/Separator';
import { buttonVariants } from '@/components/ui/Button';
import DropdownActions from '@/components/ui/DropdownActions';
import { enumReplacer, parseSynergyConfidenceLevel } from '@/util';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/Table';

interface SynergyProps {
  data: Synergy[] | null;
  addUrl: string;
  editUrl: string;
  deleteUrl: string;
}

const Synergy: FC<SynergyProps> = ({ data, addUrl, editUrl, deleteUrl }) => {
  return (
    <div className='flex flex-col gap-2'>
      <div className='pb-4'>
        <div className='flex flex-col pt-16 lg:pt-0 lg:flex-row items-start lg:items-center justify-between'>
          <Heading
            title='Startup Partnership'
            description='Startup detail information about partnership with Telkom Indonesia.'
          />
          <Link
            href={addUrl + '/contract'}
            className={cn(buttonVariants({ size: 'lg' }))}
          >
            Add new
          </Link>
        </div>
        <Separator className='mt-4 lg:mt-0' />
      </div>
      {data && data.length > 0 ? (
        <div className='w-fit'>
          <Card>
            <div className='overflow-auto max-h-[500px] max-w-6xl'>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className='p-5'>Telkom Group</TableHead>
                    <TableHead>Entity</TableHead>
                    <TableHead>Model</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Progress</TableHead>
                    <TableHead>Lead Time Week</TableHead>
                    <TableHead>Output</TableHead>
                    <TableHead>Confidence Level</TableHead>
                    <TableHead>Project Status</TableHead>
                    <TableHead>Initiation Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.map((synergy) => (
                    <TableRow key={synergy.id}>
                      <TableCell className='p-5'>
                        {synergy.telkom_group}
                      </TableCell>
                      <TableCell>{synergy.entity}</TableCell>
                      <TableCell>{enumReplacer(synergy.model)}</TableCell>
                      <TableCell>{synergy.description}</TableCell>
                      <TableCell>{enumReplacer(synergy.progress)}</TableCell>
                      <TableCell>{synergy.lead_time_week}</TableCell>
                      <TableCell>{enumReplacer(synergy.output)}</TableCell>
                      <TableCell>
                        {parseSynergyConfidenceLevel(synergy.confidence_level)}
                      </TableCell>
                      <TableCell>
                        {enumReplacer(synergy.project_status)}
                      </TableCell>
                      <TableCell>
                        {dayjs(synergy.initiation_date).format('D MMMM YYYY')}
                      </TableCell>
                      <TableCell>
                        <DropdownActions
                          editUrl={`${editUrl}/synergy/${synergy.id}`}
                          deleteUrl={`${deleteUrl}/synergy/${synergy.id}`}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>
        </div>
      ) : (
        <p className='text-sm text-muted-foreground'>
          No partnership data found.
        </p>
      )}
    </div>
  );
};

export default Synergy;
