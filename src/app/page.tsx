// import { Icons } from '@/components/Icons';
import BenefitCard from '@/components/landing-page/Benefit';
// import { Heading } from '@/components/ui/Heading';
import Image from 'next/image';
// import Link from 'next/link';

export default function Home() {
  return (
    <>
      <section>
        <span className='[&>svg]:absolute [&>svg]:-z-10 [&>svg]:hidden [&>svg]:h-[560px] [&>svg]:w-full [&>svg]:lg:block'>
          <svg
            data-name='Layer 1'
            xmlns='http://www.w3.org/2000/svg'
            viewBox='0 0 1440 320'
            preserveAspectRatio='none'
            className='absolute top-[60px] hidden h-[580px] w-full transition-opacity duration-300 dark:opacity-0 lg:block'
          >
            <defs>
              <linearGradient
                id='sw-gradient-light'
                x1='0'
                x2='0'
                y1='1'
                y2='0'
              >
                <stop stopColor='hsl(209, 92.2%, 92.1%)' offset='0%'></stop>
                <stop stopColor='hsl(209, 92.2%, 99.1%)' offset='100%'></stop>
              </linearGradient>
            </defs>
            <path
              fill='url(#sw-gradient-light)'
              d='M -0.664 3.46 C -0.664 3.46 405.288 15.475 461.728 21.285 C 601.037 35.625 672.268 76.086 701.056 97.646 C 756.056 138.838 797.267 216.257 857.745 245.156 C 885.704 258.516 980.334 280.547 1048.511 268.826 C 1121.622 256.256 1199.864 226.267 1214.176 220.176 C 1241.273 208.643 1280.201 191.509 1343.494 179.436 C 1434.325 162.111 1439.504 196.099 1439.503 183.204 C 1439.502 161.288 1440 0 1440 0 L 1360 0 C 1280 0 1120 0 960 0 C 800 0 640 0 480 0 C 320 0 160 0 80 0 L 0 0 L -0.664 3.46 Z'
            ></path>
          </svg>
          <svg
            data-name='Layer 2'
            xmlns='http://www.w3.org/2000/svg'
            viewBox='0 0 1440 320'
            preserveAspectRatio='none'
            className='absolute top-[60px] hidden h-[580px] w-full opacity-0 transition-opacity duration-300 dark:opacity-100 lg:block'
          >
            <defs>
              <linearGradient id='sw-gradient-dark' x1='0' x2='0' y1='1' y2='0'>
                <stop stopColor='hsl(240, 4%, 28%)' offset='0%'></stop>
                <stop stopColor='hsl(0, 0%, 15%)' offset='100%'></stop>
              </linearGradient>
            </defs>
            <path
              fill='url(#sw-gradient-dark)'
              d='M -0.664 3.46 C -0.664 3.46 405.288 15.475 461.728 21.285 C 601.037 35.625 672.268 76.086 701.056 97.646 C 756.056 138.838 797.267 216.257 857.745 245.156 C 885.704 258.516 980.334 280.547 1048.511 268.826 C 1121.622 256.256 1199.864 226.267 1214.176 220.176 C 1241.273 208.643 1280.201 191.509 1343.494 179.436 C 1434.325 162.111 1439.504 196.099 1439.503 183.204 C 1439.502 161.288 1440 0 1440 0 L 1360 0 C 1280 0 1120 0 960 0 C 800 0 640 0 480 0 C 320 0 160 0 80 0 L 0 0 L -0.664 3.46 Z'
            ></path>
          </svg>
        </span>

        <div className='px-6 py-12 text-center md:px-12 lg:my-12 lg:text-left'>
          <div className='w-100 mx-auto sm:max-w-2xl md:max-w-3xl lg:max-w-5xl xl:max-w-7xl'>
            <div className='grid items-center gap-12 lg:grid-cols-2'>
              <div className='mt-12 lg:mt-0'>
                <h1 className='mb-16 text-5xl font-bold tracking-tight md:text-6xl xl:text-7xl'>
                  The best offer <br />
                  <span className='text-primary'>for your business</span>
                </h1>
                <a
                  className='mb-2 inline-block rounded bg-primary px-12 pt-4 pb-3.5 text-sm font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] md:mr-2 md:mb-0'
                  data-te-ripple-init
                  data-te-ripple-color='light'
                  href='#!'
                  role='button'
                >
                  Get started
                </a>
                <a
                  className='inline-block rounded px-12 pt-4 pb-3.5 text-sm font-medium uppercase leading-normal text-primary transition duration-150 ease-in-out hover:bg-neutral-500 hover:bg-opacity-10 hover:text-primary-600 focus:text-primary-600 focus:outline-none focus:ring-0 active:text-primary-700 dark:hover:bg-neutral-700 dark:hover:bg-opacity-60'
                  data-te-ripple-init
                  data-te-ripple-color='light'
                  href='#!'
                  role='button'
                >
                  Learn more
                </a>
              </div>
              <div className='mb-12 lg:mb-0'>
                <Image
                  src='https://tecdn.b-cdn.net/img/new/standard/city/017.jpg'
                  className='w-full rounded-lg shadow-lg dark:shadow-black/20'
                  alt=''
                  width={800}
                  height={600}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className='w-full py-1 md:py-24 lg:py-32 xl:py-48'>
        <div className='container px-4 md:px-6'>
          <div className='grid gap-6 items-center'>
            <div className='flex flex-col justify-center space-y-8 text-center'>
              <div className='space-y-2'>
                <h1 className='text-3xl md:text-5xl font-extrabold text-transparent leading-tight sm:leading-tight md:leading-tight xl:leading-tight bg-clip-text bg-gradient-to-r from-black to-red-500'>
                  Benefit Mengikuti Program Indigo
                </h1>
                <p className='max-w-[600px] text-lg md:text-xl dark:text-zinc-100 mx-auto'>
                  Fasilitas apa saja yang akan diperoleh?
                </p>
              </div>
              <div className='w-full max-w-full space-y-4 mx-auto'>
                <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4'>
                  <BenefitCard />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
