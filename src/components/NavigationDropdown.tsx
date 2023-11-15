import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/NavigationMenu';
import { Menu } from 'lucide-react';
import NavigationLinks from '@/components/NavigationLinks';

const NavigationDropdown = () => {
  return (
    <NavigationMenu className='block md:hidden'>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger className='bg-transparent'>
            <Menu />
          </NavigationMenuTrigger>
          <NavigationMenuContent className='w-[200px] space-y-4 p-4 list-none bg-main'>
            <NavigationLinks />
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};

export default NavigationDropdown;
