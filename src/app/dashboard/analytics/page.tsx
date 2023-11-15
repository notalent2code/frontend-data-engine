import GameStages from '@/components/dashboard/GameStages';
import StartupSectors from '@/components/dashboard/StartupSectors';
import SummaryCards from '@/components/landing-page/SummaryCards';

const Page = () => {
  return (
    <div className='grid grid-flow-row gap-8'>
      <SummaryCards type={'dashboard'} />
      <div className='flex flex-col gap-8 lg:flex-row items-center md:items-start justify-start md:justify-between'>
      {/* <div className='grid grid-flow-col gap-4 w-full h'> */}
        <StartupSectors />
        <GameStages />
      </div>
    </div>
  );
};

export default Page;
