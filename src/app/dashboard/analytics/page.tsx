import GameStages from '@/components/dashboard/GameStages';
import RevenueSummary from '@/components/dashboard/RevenueSummary';
import StartupSectors from '@/components/dashboard/StartupSectors';
import TopRevenue from '@/components/dashboard/TopRevenue';
import SummaryCards from '@/components/landing-page/SummaryCards';

const Page = () => {
  return (
    <div className='grid grid-flow-row gap-8'>
      <SummaryCards type={'dashboard'} />
      <div className='grid grid-cols-1 md:grid-cols-[2fr,1fr] gap-8 items-center md:items-start justify-start md:justify-between'>
        <StartupSectors />
        <GameStages />
      </div>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
        <TopRevenue />
      </div>
      <RevenueSummary />
    </div>
  );
};

export default Page;
