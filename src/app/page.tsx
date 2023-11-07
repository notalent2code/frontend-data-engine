import Hero from '@/components/landing-page/Hero';
import Program from '@/components/landing-page/Program';
import Benefit from '@/components/landing-page/Benefit';

export default function Home() {
  return (
    <div className='flex flex-col gap-8 pt-12'>
      <Hero className='p-8' id='hero' />
      <Program />
      <Benefit className='p-8 bg-gradient-radial from-slate-100 to-zinc-200' />
    </div>
  );
}
