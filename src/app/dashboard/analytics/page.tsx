import StartupSectors from '@/components/dashboard/StartupSectors';
import SummaryCards from '@/components/landing-page/SummaryCards';
import { Card } from '@/components/ui/Card';

const Page = () => {
  return (
    <div className='grid grid-flow-row gap-8'>
      <SummaryCards type={'dashboard'} />
      <div className='flex flex-row items-center'>
        <StartupSectors />
        <Card className='ml-8'>
          <div className='text-2xl font-semibold'>Startup Stages</div>
          <div className='text-4xl font-bold'>5</div>
        </Card>
      </div>
    </div>
  );
};

export default Page;
