import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/NavigationMenu';
import { Menu } from 'lucide-react';
import NavigationLinks from '@/components/NavigationLinks';
import { useAuthStore } from '@/store/auth-store';

const NavigationDropdown = () => {
  const role = useAuthStore((state) => state.session?.role);

  return (
    <NavigationMenu className='block md:hidden'>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger className='bg-transparent'>
            <Menu />
          </NavigationMenuTrigger>
          <NavigationMenuContent className='w-[200px] space-y-4 p-4 list-none main-bg'>
            <NavigationLinks role={role} />
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};

export default NavigationDropdown;
