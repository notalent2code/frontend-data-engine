'use client';

import Link from 'next/link';
import Search from '@/components/Search';
import { Badge } from '@/components/ui/Badge';
import { Loader } from '@/components/ui/Loader';
import { Investor, Role } from '@prisma/client';
import { useDebounce } from '@uidotdev/usehooks';
import { useAuthStore } from '@/store/auth-store';
import { CircleDollarSign, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import useAxiosPrivate from '@/hooks/use-axios-private';
import SelectDropdown from '@/components/SelectDropdown';
import { investorTypeOptions, Pagination } from '@/types';
import { enumReplacer, formatCurrencyValue } from '@/util';
import { Button, buttonVariants } from '@/components/ui/Button';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';

const Page = () => {
  const axios = useAxiosPrivate();
  const intersectionRef = useRef(null);
  const role = useAuthStore((state) => state.session?.role);
  const queryClient = useQueryClient();
  const [instrumentType, setInstrumentType] = useState<string>('');
  const [search, setSearch] = useState<string>('');
  const debouncedSearch = useDebounce(search, 750);

  const handleInstrumentTypeChange = (value: string) => {
    setInstrumentType(value);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const resetFilters = () => {
    setInstrumentType('');
    setSearch('');
  };

  const fetchVentureCapitals = async ({ pageParam = 1 }) => {
    const queryParams = [
      `page=${pageParam}`,
      instrumentType && `instrument_type=${instrumentType}`,
      debouncedSearch && `search=${debouncedSearch}`,
    ]
      .filter(Boolean)
      .join('&');

    const { data: result } = await axios.get(`/investor?${queryParams}`);

    return {
      meta: result.meta as Pagination,
      data: result.data as Investor[],
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
    queryKey: ['venture-capitals', instrumentType, debouncedSearch],
    queryFn: fetchVentureCapitals,
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage!.meta.next,
  });

  useEffect(() => {
    queryClient.invalidateQueries({
      queryKey: ['venture-capitals', instrumentType, debouncedSearch],
    });
  }, [instrumentType, debouncedSearch, queryClient]);

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
            name={enumReplacer(instrumentType) || 'Instrument Type'}
            options={investorTypeOptions}
            onChange={handleInstrumentTypeChange}
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
            Add new
          </Link>
        ) : null}
      </div>
      {data.pages.map((page, i) => (
        <div key={i} className='grid grid-cols-1 md:grid-cols-2 gap-6 pb-6'>
          {page.data.map((investor) => (
            <Link
              key={investor.id}
              href={`/dashboard/venture-capital/${investor.id}`}
            >
              <Card
                key={investor.id}
                className='grid grid-flow-row items-start justify-start h-full'
              >
                <CardHeader className='grid grid-flow-row lg:grid-flow-col items-center justify-start'>
                  <div className='space-y-2'>
                    <h2 className='text-xl text-left font-semibold'>
                      {investor.name}
                    </h2>
                    <div className='grid grid-cols-2 lg:flex lg:flex-auto gap-2 pb-4'>
                      <Badge className='text-xs bg-primary'>
                        {enumReplacer(investor.instrument_type)}
                      </Badge>
                      <Badge className='text-xs bg-violet-800 hover:bg-violet-800 hover:opacity-90'>
                        {enumReplacer(investor.investment_syndication)}
                      </Badge>
                      <Badge className='text-xs bg-blue-800 hover:bg-blue-800 hover:opacity-90 '>
                        {enumReplacer(investor.investor_classification)}
                      </Badge>
                    </div>
                    <h1 className='font-bold'>Investment Stage</h1>
                    <div className='grid grid-cols-4 w-fit gap-2 pb-4'>
                      {investor.investment_stage.map((stage) => (
                        <Badge
                          key={stage}
                          className='text-xs bg-tertiary hover:bg-tertiary hover:opacity-90'
                        >
                          {enumReplacer(stage)}
                        </Badge>
                      ))}
                    </div>
                    <div className='flex flex-row items-start justify-start gap-4'>
                      <Card className='flex flex-row h-full items-center justify-start text-sm gap-2 p-4'>
                        <span className='font-bold'>Ticket Size (USD)</span>
                        <CircleDollarSign className='w-4 h-4' />
                        {formatCurrencyValue(
                          parseInt(investor.ticket_size_min.toString())
                        )}{' '}
                        -{' '}
                        {formatCurrencyValue(
                          parseInt(investor.ticket_size_max.toString())
                        )}
                      </Card>
                    </div>
                    {/* <Card className='flex flex-row items-center justify-start text-sm gap-2 p-4'>
                        <span className='font-bold'>Investment Stage</span>
                        <BarChart2 className='w-4 h-4' />
                        {investor.investment_stage.map((stage) => (
                          <span key={stage}>{enumReplacer(stage)}</span>
                        ))}
                      </Card> */}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className='line-clamp-4'>{investor.remarks}</p>
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

export default Page;
