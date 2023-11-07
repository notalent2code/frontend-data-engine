import Hero from '@/components/landing-page/Hero';
import Program from '@/components/landing-page/Program';
import Benefit from '@/components/landing-page/Benefit';

export default function Home() {
  return (
    <div className='flex flex-col gap-8'>
      <Hero className='py-8 px-8' id='hero' />
      <Program />
      <Benefit
        className='py-8 bg-gradient-radial 
        from-slate-200 to-zinc-100'
      />
    </div>
  );
}
