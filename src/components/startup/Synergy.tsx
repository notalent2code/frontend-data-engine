'use client';

import { FC } from 'react';
import Link from 'next/link';
import dayjs from 'dayjs';
import { cn } from '@/lib/utils';
import { Synergy } from '@prisma/client';
import { Card } from '@/components/ui/Card';
import { Heading } from '@/components/ui/Heading';
import { Separator } from '@/components/ui/Separator';
import { buttonVariants } from '@/components/ui/Button';
import { enumReplacer, parseSynergyConfidenceLevel } from '@/util';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/Table';
import useAxiosPrivate from '@/hooks/use-axios-private';
import { useAuthStore } from '@/store/auth-store';
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/Tooltip';
import { Edit, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

interface SynergyProps {
  data: Synergy[] | null;
  baseUrl: string;
}

const Synergy: FC<SynergyProps> = ({ data, baseUrl }) => {
  const axios = useAxiosPrivate();
  const role = useAuthStore((state) => state.session?.role);

  const deleteSynergy = async (id: string) => {
    try {
      await axios.delete(`/synergy/${id}`);
      toast.success('Synergy deleted successfully!');
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (err) {
      toast.error('Failed to delete synergy!');
    }
  };

  return (
    <div className='flex flex-col gap-2'>
      <div className='pb-4'>
        <div className='flex flex-col pt-16 lg:pt-0 lg:flex-row items-start lg:items-center justify-between'>
          <Heading
            title='Startup Partnership'
            description='Startup detail information about partnership with Telkom Indonesia.'
          />
          {role === 'ADMIN' && (
            <Link
              href={baseUrl + '/synergy/create'}
              className={cn(
                buttonVariants({ size: 'sm' }),
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
        <div className='w-fit'>
          <Card>
            <div className='overflow-auto max-h-[500px] max-w-6xl'>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className='px-4 py-2 text-xs'>
                      Telkom Group
                    </TableHead>
                    <TableHead className='px-4 py-2 text-xs'>Entity</TableHead>
                    <TableHead className='px-4 py-2 text-xs'>Model</TableHead>
                    <TableHead className='px-4 py-2 text-xs'>
                      Description
                    </TableHead>
                    <TableHead className='px-4 py-2 text-xs'>
                      Progress
                    </TableHead>
                    <TableHead className='px-4 py-2 text-xs'>
                      Lead Time Week
                    </TableHead>
                    <TableHead className='px-4 py-2 text-xs'>Output</TableHead>
                    <TableHead className='px-4 py-2 text-xs'>
                      Confidence Level
                    </TableHead>
                    <TableHead className='px-4 py-2 text-xs'>
                      Project Status
                    </TableHead>
                    <TableHead className='px-4 py-2 text-xs'>
                      Initiation Date
                    </TableHead>
                    {role === 'ADMIN' && (
                      <TableHead className='px-4 py-2 text-xs'>
                        Actions
                      </TableHead>
                    )}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className='px-4 py-2 text-xs'>
                        {item.telkom_group}
                      </TableCell>
                      <TableCell className='px-4 py-2 text-xs'>
                        {item.entity}
                      </TableCell>
                      <TableCell className='px-4 py-2 text-xs'>
                        {enumReplacer(item.model)}
                      </TableCell>
                      <TableCell className='px-4 py-2 text-xs'>
                        {item.description}
                      </TableCell>
                      <TableCell className='px-4 py-2 text-xs'>
                        {enumReplacer(item.progress)}
                      </TableCell>
                      <TableCell className='px-4 py-2 text-xs'>
                        {item.lead_time_week}
                      </TableCell>
                      <TableCell className='px-4 py-2 text-xs'>
                        {enumReplacer(item.output)}
                      </TableCell>
                      <TableCell className='px-4 py-2 text-xs'>
                        {parseSynergyConfidenceLevel(item.confidence_level)}
                      </TableCell>
                      <TableCell className='px-4 py-2 text-xs'>
                        {enumReplacer(item.project_status)}
                      </TableCell>
                      <TableCell className='px-4 py-2 text-xs'>
                        {dayjs(item.initiation_date).format('D MMMM YYYY')}
                      </TableCell>
                      {role === 'ADMIN' && (
                        <TableCell className='px-4 py-2 text-xs'>
                          <div className='flex flex-row gap-2'>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger>
                                  <Link
                                    href={`${baseUrl}/synergy/${item.id}/edit`}
                                  >
                                    <Edit className='h-6 w-6' />
                                  </Link>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Edit data</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>

                            <AlertDialog>
                              <AlertDialogTrigger>
                                <Trash2 className='h-6 w-6' />
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>
                                    Are you absolutely sure?
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Please be aware that this action is
                                    irreversible. Once completed, the data will
                                    be permanently erased and cannot be
                                    retrieved.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => deleteSynergy(item.id)}
                                  >
                                    Continue
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>
        </div>
      ) : (
        <p className='text-sm text-muted-foreground py-2'>
          No partnership data found.
        </p>
      )}
    </div>
  );
};

export default Synergy;
