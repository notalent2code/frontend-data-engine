import React, { FC } from 'react';
import ProgramCards from '@/components/landing-page/ProgramCards';

interface ProgramProps extends React.HTMLAttributes<HTMLDivElement> {}

const Program: FC<ProgramProps> = ({ ...props }) => {
  return (
    <section {...props}>
      <div className='container px-4 md:px-6'>
        <div className='grid gap-6 items-center'>
          <div className='flex flex-col justify-center space-y-8 text-center'>
            <div className='space-y-2'>
              <h1 className='text-3xl md:text-5xl font-extrabold text-transparent leading-tight sm:leading-tight md:leading-tight xl:leading-tight bg-clip-text bg-gradient-to-r from-black to-red-500'>
                Program yang Diselenggarakan Indigo
              </h1>
            </div>
            <div className='w-full max-w-full space-y-4 mx-auto'>
              <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
                <ProgramCards />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Program;
