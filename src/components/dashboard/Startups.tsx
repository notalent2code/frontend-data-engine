'use client';

import Image from 'next/image';
import Link from 'next/link';
import { FC, useEffect, useRef, useState } from 'react';
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { Role, Startup } from '@prisma/client';
import { Pagination, startupCategoryOptions } from '@/types';
import { Badge } from '@/components/ui/Badge';
import useAxiosPrivate from '@/hooks/use-axios-private';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import Search from '@/components/Search';
import { useDebounce } from '@uidotdev/usehooks';
import { Loader } from '@/components/ui/Loader';
import SelectDropdown from '@/components/SelectDropdown';
import { enumReplacer } from '@/util';
import { useAuthStore } from '@/store/auth-store';
import { buttonVariants } from '@/components/ui/Button';

interface StartupsProps {
  link: 'catalog' | 'detail';
}

const Startups: FC<StartupsProps> = ({ link }) => {
  const axios = useAxiosPrivate();
  const intersectionRef = useRef(null);
  const role = useAuthStore((state) => state.session?.role);
  const queryClient = useQueryClient();
  const [category, setCategory] = useState<string>('');
  const [search, setSearch] = useState<string>('');
  const debouncedSearch = useDebounce(search, 750);

  const handleCategoryChange = (value: string) => {
    setCategory(value);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const fetchStartups = async ({ pageParam = 1 }) => {
    let url = `startups?page=${pageParam}`;
    if (!!category) {
      url += `&category=${category}`;
    }
    if (!!debouncedSearch) {
      url += `&search=${debouncedSearch}`;
    }

    const { data: result } = await axios.get(url);

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
    queryKey: ['startups', category, debouncedSearch],
    queryFn: fetchStartups,
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.meta.next,
  });

  useEffect(() => {
    queryClient.invalidateQueries({
      queryKey: ['startups', category, debouncedSearch],
    });
  }, [category, debouncedSearch, queryClient]);

  useEffect(() => {
    const options: IntersectionObserverInit = {
      root: null, // Use the viewport as the root
      rootMargin: '0px',
      threshold: 1.0, // 1.0 means when the element is fully in the viewport
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
      // Clean up the observer when the component unmounts
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
        <div className='flex flex-col md:flex-row md:gap-4 items-center'>
          <Search autoFocus value={search} onChange={handleSearchChange} />
          <SelectDropdown
            name={enumReplacer(category) || 'Category'}
            options={startupCategoryOptions}
            onChange={handleCategoryChange}
          />
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
                  : `/startups/${startup.id}/${link}`
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
