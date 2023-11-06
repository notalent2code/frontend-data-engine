import Hero from '@/components/landing-page/Hero';
import Program from '@/components/landing-page/Program';
import Benefit from '@/components/landing-page/Benefit';

export default function Home() {
  return (
    <div className='flex flex-col gap-20'>
      <Hero className='rounded-md shadow-md py-8 bg-[#be3455]' />
      <Program />
      <Benefit
        className='rounded-md shadow-md py-8 bg-gradient-radial 
        from-slate-200 to-zinc-100'
      />
    </div>
  );
}
