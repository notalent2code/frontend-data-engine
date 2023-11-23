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
import { X } from 'lucide-react';
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
import DropdownActions from '@/components/ui/DropdownActions';
import { Button, buttonVariants } from '@/components/ui/Button';
import { useQuery, useQueryClient } from '@tanstack/react-query';

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

  return isLoading ? (
    <p>Loading...</p>
  ) : error ? (
    <p>Error: {error.message}</p>
  ) : result ? (
    <div>
      <div className='flex flex-col md:flex-row gap-4 items-center justify-start md:justify-between pb-4 md:pb-2'>
        <div className='flex flex-col md:flex-row md:gap-4 w-fit items-center'>
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

      <Card>
        <div className='overflow-auto max-h-[500px]'>
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
                  <TableCell className='px-4 py-1'>{item.role}</TableCell>
                  <TableCell className='px-4 py-1'>{item.status}</TableCell>
                  <TableCell className='px-4 py-1'>
                    <DropdownActions
                      editUrl={`/dashboard/manage-users/edit/${item.id}`}
                    />
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
    <p className='text-sm text-muted-foreground'>
      No startup to invest data found.
    </p>
  );
};

export default Page;
