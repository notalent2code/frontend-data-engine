'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/Table';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Check, Edit, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { User } from '@prisma/client';
import Search from '@/components/Search';
import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { useRouter } from 'next/navigation';
import { useDebounce } from '@uidotdev/usehooks';
import { Pagination, userRoleOptions } from '@/types';
import useAxiosPrivate from '@/hooks/use-axios-private';
import SelectDropdown from '@/components/SelectDropdown';
import { Button, buttonVariants } from '@/components/ui/Button';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Badge } from '@/components/ui/Badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/DropdownMenu';
import { DotsHorizontalIcon } from '@radix-ui/react-icons';

const Page = () => {
  const axios = useAxiosPrivate();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [page, setPage] = useState<number>(1);
  const [role, setRole] = useState<string>('');
  const [search, setSearch] = useState<string>('');
  const debouncedSearch = useDebounce(search, 750);

  const handleRoleChange = (value: string) => {
    setRole(value);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const resetFilters = () => {
    setRole('');
    setSearch('');
  };

  const fetchUsers = async () => {
    try {
      const queryParams = [
        `page=${page}`,
        role && `role=${role}`,
        debouncedSearch && `search=${debouncedSearch}`,
      ]
        .filter(Boolean)
        .join('&');

      const { data: result } = await axios.get(`users?${queryParams}`);

      return {
        meta: result.meta as Pagination,
        data: result.data as User[],
      };
    } catch (error: any) {
      toast.error('Failed to fetch users');
      router.push('/auth/login');
    }
  };

  const {
    data: result,
    error,
    isLoading,
  } = useQuery({
    queryKey: ['users', page, role, debouncedSearch],
    queryFn: fetchUsers,
  });

  useEffect(() => {
    queryClient.invalidateQueries({
      queryKey: ['users', page, role, debouncedSearch],
    });
  }, [page, role, debouncedSearch, queryClient]);

  const handleToggleInvestorStatus = async (id: string) => {
    try {
      await axios.patch(`users/status/${id}`);
      toast.success('User status changed successfully');
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error: any) {
      toast.error('Failed to change user status');
    }
  };

  return isLoading ? (
    <p>Loading...</p>
  ) : error ? (
    <p>Error: {error.message}</p>
  ) : result ? (
    <div>
      <div className='flex flex-col md:flex-row gap-4 items-center justify-start md:justify-between pb-4 md:pb-2'>
        <div className='flex flex-col md:flex-row gap-2 md:gap-4 w-fit items-center'>
          <Search autoFocus value={search} onChange={handleSearchChange} />
          <SelectDropdown
            name={role || 'Role'}
            options={userRoleOptions}
            onChange={handleRoleChange}
          />
          <Button
            onClick={() => resetFilters()}
            variant={'outline'}
            className='bg-white'
          >
            <X color='gray' />
          </Button>
        </div>
        <Link
          href='/dashboard/manage-users/create-admin'
          className={cn(buttonVariants({ size: 'lg' }))}
        >
          Create new admin
        </Link>
      </div>

      <Card className='w-fit'>
        <div className='overflow-auto max-h-[500px] max-w-[340px] md:max-w-6xl'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className='px-4 py-1'>First Name</TableHead>
                <TableHead className='px-4 py-1'>Last Name</TableHead>
                <TableHead className='px-4 py-1'>Email</TableHead>
                <TableHead className='px-4 py-1'>Phone Number</TableHead>
                <TableHead className='px-4 py-1'>Role</TableHead>
                <TableHead className='px-4 py-1'>Status</TableHead>
                <TableHead className='px-4 py-1'>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {result.data.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className='px-4 py-1'>{item.first_name}</TableCell>
                  <TableCell className='px-4 py-1'>{item.last_name}</TableCell>
                  <TableCell className='px-4 py-1'>{item.email}</TableCell>
                  <TableCell className='px-4 py-1'>
                    {item.phone_number}
                  </TableCell>
                  <TableCell className='px-4 py-1'>
                    {item.role === 'ADMIN' ? (
                      <Badge>Admin</Badge>
                    ) : (
                      <Badge variant='secondary'>Investor</Badge>
                    )}
                  </TableCell>
                  <TableCell className='px-4 py-1'>
                    {item.status === 'ACTIVE' ? (
                      <Check className=' text-white text-xs bg-green-500 rounded-full p-1' />
                    ) : (
                      <X className=' text-white text-xs bg-red-500 rounded-full p-1' />
                    )}
                  </TableCell>
                  <TableCell className='px-4 py-1'>
                    {item.role === 'INVESTOR' && item.status && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant='ghost'
                            className='flex h-8 w-8 p-0 data-[state=open]:bg-muted'
                          >
                            <DotsHorizontalIcon className='h-4 w-4' />
                            <span className='sr-only'>Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align='end' className='w-[160px]'>
                          <DropdownMenuItem
                            className='cursor-pointer'
                            onClick={() => handleToggleInvestorStatus(item.id)}
                          >
                            <Edit className='h-4 w-4 mr-2' />
                            {item.status === 'ACTIVE'
                              ? 'Deactivate'
                              : 'Activate'}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
      <div className='flex items-center justify-end space-x-2 py-4'>
        <Button
          className='bg-white'
          variant='outline'
          size='sm'
          onClick={() => setPage((prev) => prev - 1)}
          disabled={!result.meta.prev}
        >
          Previous
        </Button>
        <Button
          className='bg-white'
          variant='outline'
          size='sm'
          onClick={() => setPage((prev) => prev + 1)}
          disabled={!result.meta.next}
        >
          Next
        </Button>
      </div>
    </div>
  ) : (
    <p className='text-sm text-muted-foreground py-2'>No user data found.</p>
  );
};

export default Page;
