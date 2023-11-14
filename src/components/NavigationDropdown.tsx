import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/NavigationMenu';
import { Menu } from 'lucide-react';
import { links } from '@/components/NavigationLinks';

const NavigationDropdown = () => {
  return (
    <NavigationMenu className='block md:hidden'>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger className='bg-transparent'>
            <Menu />
          </NavigationMenuTrigger>
          <NavigationMenuContent className='w-[200px] space-y-4 p-4 list-none'>
            {links.map((link) => (
              <NavigationMenuItem key={link.name}>
                <NavigationMenuLink href={link.path}>
                  <div className='flex items-center space-x-2'>
                    <link.icon className='w-4 h-4' />
                    <span className='text-sm'>{link.name}</span>
                  </div>
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};

export default NavigationDropdown;
