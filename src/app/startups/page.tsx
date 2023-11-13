'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Fragment, useEffect, useRef, useState } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { Startup } from '@prisma/client';
import { Pagination } from '@/types';
import { Badge } from '@/components/ui/Badge';
import useAxiosPrivate from '@/hooks/use-axios-private';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import Search from '@/components/Search';
import { useDebounce } from '@uidotdev/usehooks';

const Page = () => {
  const axios = useAxiosPrivate();
  const intersectionRef = useRef(null);
  const [search, setSearch] = useState<string>('');
  const debouncedSearch = useDebounce(search, 500);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  }

  const fetchStartups = async ({ pageParam = 1 }) => {
    let url = `startups?limit=50&page=${pageParam}`;
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
    queryKey: ['startups', useDebounce],
    queryFn: fetchStartups,
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.meta.next,
  });

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
    <p>Loading...</p>
  ) : status === 'error' ? (
    <p>Error: {error.message}</p>
  ) : (
    <div className='pt-20'>
      <div className=''>
        <Search value={search} onChange={handleSearchChange} />
      </div>
      {data.pages.map((page, i) => (
        <Fragment key={i}>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            {page.data.map((startup) => (
              <Link href={`/startups/${startup.id}/catalog`} key={startup.id}>
                <Card
                  key={startup.id}
                  className='grid grid-flow-row items-end justify-start h-full'
                >
                  <CardHeader className='grid grid-flow-row lg:grid-flow-col items-center justify-start'>
                    <div className='w-20 h-20 flex justify-start items-center'>
                      <Image
                        src={startup.logo_url}
                        width={80}
                        height={80}
                        style={{ width: 'auto', height: 'auto' }}
                        alt={startup.name}
                      />
                    </div>
                    <div className='space-y-2 lg:pl-6'>
                      <h2 className='text-md text-left font-semibold'>
                        {startup.name}
                      </h2>
                      <div className='grid grid-cols-2 lg:flex lg:flex-row gap-2 pb-4'>
                        <Badge className='text-xs bg-primary'>
                          {startup.category}
                        </Badge>
                        <Badge className='text-xs bg-tertiary hover:bg-tertiary hover:opacity-90'>
                          {startup.latest_stage}
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
                    <p className='line-clamp-3'>{startup.description}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </Fragment>
      ))}
      <div ref={intersectionRef}></div> {/* Add this element for observing */}
      <div className=''>
        {isFetchingNextPage ? 'Loading more...' : 'Nothing more to load'}
      </div>
      <div className=''>
        {isFetching && !isFetchingNextPage ? 'Fetching...' : null}
      </div>
    </div>
  );
};

export default Page;
