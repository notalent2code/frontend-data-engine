import Hero from '@/components/landing-page/Hero';
import Program from '@/components/landing-page/Program';
import Benefit from '@/components/landing-page/Benefit';
import Summary from '@/components/landing-page/Summary';
import Footer from '@/components/landing-page/Footer';
import Navbar from '@/components/Navbar';

export default function Home() {
  return (
    <div className='flex flex-col gap-12 pt-12'>
      <Navbar logo />
      <Hero className='p-8 main-bg' />
      <Program />
      <Summary className='p-8 bg-gradient-radial from-slate-100 to-zinc-200' />
      <Benefit />
      <Footer className='p-8 main-bg' />
    </div>
  );
}
