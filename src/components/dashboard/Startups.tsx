'use client';

import {
  Pagination,
  startupCategoryOptions,
  startupStageOptions,
  startupStatusOptions,
} from '@/types';
import Image from 'next/image';
import Link from 'next/link';
import { X } from 'lucide-react';
import { FC, useEffect, useRef, useState } from 'react';
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { Role, Startup } from '@prisma/client';
import { Badge } from '@/components/ui/Badge';
import useAxiosPrivate from '@/hooks/use-axios-private';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import Search from '@/components/Search';
import { useDebounce } from '@uidotdev/usehooks';
import { Loader } from '@/components/ui/Loader';
import SelectDropdown from '@/components/SelectDropdown';
import { enumReplacer } from '@/util';
import { useAuthStore } from '@/store/auth-store';
import { Button, buttonVariants } from '@/components/ui/Button';

interface StartupsProps {
  link: 'catalog' | 'detail';
}

const Startups: FC<StartupsProps> = ({ link }) => {
  const axios = useAxiosPrivate();
  const intersectionRef = useRef(null);
  const role = useAuthStore((state) => state.session?.role);
  const queryClient = useQueryClient();
  const [category, setCategory] = useState<string>('');
  const [startupStage, setStartupStage] = useState<string>('');
  const [startupStatus, setStartupStatus] = useState<string>('');
  const [search, setSearch] = useState<string>('');
  const debouncedSearch = useDebounce(search, 750);

  const handleCategoryChange = (value: string) => {
    setCategory(value);
  };

  const handleStageChange = (value: string) => {
    setStartupStage(value);
  };

  const handleStatusChange = (value: string) => {
    setStartupStatus(value);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const resetFilters = () => {
    setCategory('');
    setStartupStage('');
    setStartupStatus('');
    setSearch('');
  };

  const fetchStartups = async ({ pageParam = 1 }) => {
    const queryParams = [
      `page=${pageParam}`,
      category && `category=${category}`,
      startupStage && `stage=${startupStage}`,
      startupStatus && `status=${startupStatus}`,
      debouncedSearch && `search=${debouncedSearch}`,
    ]
      .filter(Boolean)
      .join('&');

    const {data: result} = await axios.get(`startups?${queryParams}`);

    return {
      meta: result.meta as Pagination,
      data: result.data as Startup[],
    };
  };

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: [
      'startups',
      category,
      startupStage,
      startupStatus,
      debouncedSearch,
    ],
    queryFn: fetchStartups,
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.meta.next,
  });

  useEffect(() => {
    queryClient.invalidateQueries({
      queryKey: [
        'startups',
        category,
        startupStage,
        startupStatus,
        debouncedSearch,
      ],
    });
  }, [category, startupStage, startupStatus, debouncedSearch, queryClient]);

  useEffect(() => {
    const options: IntersectionObserverInit = {
      root: null,
      rootMargin: '0px',
      threshold: 1.0,
    };

    const handleIntersection: IntersectionObserverCallback = (entries: any) => {
      const entry = entries[0];
      if (
        entry.isIntersecting &&
        hasNextPage &&
        !isFetching &&
        !isFetchingNextPage
      ) {
        fetchNextPage();
      }
    };

    const observer = new IntersectionObserver(handleIntersection, options);
    let observerRefValue: Element | null = null;

    if (intersectionRef.current) {
      observer.observe(intersectionRef.current);
      observerRefValue = intersectionRef.current;
    }

    return () => {
      if (observerRefValue) {
        observer.unobserve(observerRefValue);
      }
    };
  }, [fetchNextPage, hasNextPage, isFetching, isFetchingNextPage]);

  return status === 'pending' ? (
    <Loader />
  ) : status === 'error' ? (
    <p>Error: {error.message}</p>
  ) : (
    <div>
      <div className='flex flex-col md:flex-row gap-4 items-center justify-start md:justify-between pb-4 md:pb-2'>
        <div className='flex flex-col md:flex-row md:gap-4 w-fit items-center'>
          <Search autoFocus value={search} onChange={handleSearchChange} />
          <SelectDropdown
            name={enumReplacer(category) || 'Category'}
            options={startupCategoryOptions}
            onChange={handleCategoryChange}
          />
          <SelectDropdown
            name={enumReplacer(startupStage) || 'Stage'}
            options={startupStageOptions}
            onChange={handleStageChange}
          />
          <SelectDropdown
            name={enumReplacer(startupStatus) || 'Status'}
            options={startupStatusOptions}
            onChange={handleStatusChange}
          />
          <Button
            onClick={() => resetFilters()}
            variant={'outline'}
            className='bg-white'
          >
            <X color='gray' />
          </Button>
        </div>
        {role === Role.ADMIN ? (
          <Link href='/admin/startups/new' className={buttonVariants()}>
            Add Startup
          </Link>
        ) : null}
      </div>
      {data.pages.map((page, i) => (
        <div key={i} className='grid grid-cols-1 md:grid-cols-2 gap-6 pb-6'>
          {page.data.map((startup) => (
            <Link
              key={startup.id}
              href={
                link === 'detail'
                  ? `/dashboard/startups/${startup.id}/${link}`
                  : `/${link}/${startup.id}`
              }
            >
              <Card
                key={startup.id}
                className='grid grid-flow-row items-start justify-start h-full'
              >
                <CardHeader className='grid grid-flow-row lg:grid-flow-col items-center justify-start'>
                  <div className='w-20 h-20 flex justify-start items-center'>
                    <Image
                      src={startup.logo_url}
                      width={80}
                      height={80}
                      alt={startup.name}
                    />
                  </div>
                  <div className='space-y-2 lg:pl-6'>
                    <h2 className='text-md text-left font-semibold'>
                      {startup.name}
                    </h2>
                    <div className='grid grid-cols-2 lg:flex lg:flex-row gap-2 pb-4'>
                      <Badge className='text-xs bg-primary'>
                        {enumReplacer(startup.category)}
                      </Badge>
                      <Badge className='text-xs bg-violet-800 hover:bg-violet-800 hover:opacity-90'>
                        {enumReplacer(startup.latest_stage)}
                      </Badge>
                      <Badge className='text-xs bg-blue-800 hover:bg-blue-800 hover:opacity-90 '>
                        {startup.status}
                      </Badge>
                      <Badge className='text-xs bg-black hover:bg-black hover:opacity-90 '>
                        {startup.intake_year}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className='line-clamp-5'>{startup.description}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      ))}
      {/* Infinite scrolling observer */}
      <div ref={intersectionRef}></div>
      <div className='text-sm text-muted-foreground'>
        {isFetchingNextPage || (isFetching && !isFetchingNextPage)
          ? 'Loading...'
          : !data.pages[0].data.length
          ? 'Data not found'
          : 'All data fetched'}
      </div>
    </div>
  );
};

export default Startups;
