import GameStages from '@/components/dashboard/GameStages';
import TotalYearlyRevenue from '@/components/dashboard/YearlyRevenue';
import StartupSectors from '@/components/dashboard/StartupSectors';
import TopRevenue from '@/components/dashboard/TopRevenue';
import SummaryCards from '@/components/landing-page/SummaryCards';

const Page = () => {
  return (
    <div className='grid grid-flow-row gap-8'>
      <SummaryCards type={'dashboard'} />
      <div className='flex flex-col md:flex-row gap-8 items-center justify-between'>
        <StartupSectors />
        <GameStages />
      </div>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
        <TopRevenue />
      </div>
      <TotalYearlyRevenue />
    </div>
  );
};

export default Page;
