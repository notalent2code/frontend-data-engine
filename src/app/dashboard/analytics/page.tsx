import GameStages from '@/components/dashboard/GameStages';
import StartupSectors from '@/components/dashboard/StartupSectors';
import SummaryCards from '@/components/landing-page/SummaryCards';

const Page = () => {
  return (
    <div className='grid grid-flow-row gap-8'>
      <SummaryCards type={'dashboard'} />
      <div className='flex flex-col gap-4 md:gap-0 lg:flex-row items-start md:items-center justify-between'>
        <StartupSectors />
        <GameStages />
      </div>
    </div>
  );
};

export default Page;
