import React, { FC } from 'react';
import BenefitCards from '@/components/landing-page/BenefitCards';

interface BenefitProps extends React.HTMLAttributes<HTMLDivElement> {}

const Benefit: FC<BenefitProps> = ({...props}) => {
  return (
    <section {...props}>
      <div className='container px-4 md:px-6'>
        <div className='grid gap-6 items-center'>
          <div className='flex flex-col justify-center space-y-8 text-center'>
            <div className='space-y-2'>
              <h1 className='text-3xl md:text-5xl font-extrabold text-transparent leading-tight sm:leading-tight md:leading-tight xl:leading-tight bg-clip-text bg-gradient-to-r from-black to-red-500'>
                Benefit Mengikuti Program Indigo
              </h1>
              <p className='max-w-[600px] text-lg md:text-xl text-zinc-700 dark:text-zinc-100 font-semibold mx-auto'>
                Fasilitas apa saja yang akan diperoleh?
              </p>
            </div>
            <div className='w-full max-w-full space-y-4 mx-auto'>
              <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4'>
                <BenefitCards />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Benefit;
