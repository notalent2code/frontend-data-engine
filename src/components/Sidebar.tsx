import Link from 'next/link';
import { Icons } from '@/components/Icons';
import NavigationLinks from '@/components/NavigationLinks';

const Sidebar = () => {
  return (
    <aside className='sticky top-0 z-10 hidden md:block h-screen w-56 p-4 main-bg'>
      <div className='flex items-center mb-4 justify-start space-x-1 pl-2'>
        <Link href='/dashboard/analytics'>
          <Icons.whiteLogo />
        </Link>
      </div>
      <nav className='space-y-2'>
        <NavigationLinks />
      </nav>
    </aside>
  );
};

export default Sidebar;
