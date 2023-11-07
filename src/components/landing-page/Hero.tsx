import Link from 'next/link';
import Image from 'next/image';
import { FC } from 'react';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/Button';

interface HeroProps extends React.HTMLAttributes<HTMLDivElement> {}

const Hero: FC<HeroProps> = ({...props}) => {
  return (
    <section {...props}>
      <div className='grid items-center gap-12 lg:grid-cols-2'>
        <div className='px-10 space-y-4 text-white text-center xl:text-left'>
          <h1 className='text-7xl font-bold tracking-tight'>
            Indigo<br />Data Engine
          </h1>
          <h2 className='text-xl'>
            Akselerasi perkembangan startup kamu <br /> bersama Indigo!
          </h2>
          <Link href='/portfolio' className={cn(buttonVariants({variant: 'outline'}))}>
            <p className='px-6'>Lihat Portfolio</p>
          </Link>
        </div>
        <div className='flex flex-col sm:items-center xl:items-end'>
          <Image
            src='/hero-image.jpg'
            alt='hero-image'
            priority={true}
            unoptimized={true}
            width={400}
            height={400}
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;
