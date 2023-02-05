import type { ComponentPropsWithoutRef, FC } from 'react';
import { HamburgerMenu } from '../hamburger-menu/hamburger-menu.container';
import { NavigationMenu } from '@/common/component/navigation-menu/navigation-menu.presenter';
import { twMerge } from '@/common/util/tw-merge.util';

export type HeaderProps = Omit<ComponentPropsWithoutRef<'header'>, 'children'>;

export const Header: FC<HeaderProps> = ({ className, ...props }) => (
  <header
    className={twMerge('z-50 bg-white py-6 px-5 font-inter shadow-lg justify-between md:justify-center flex items-center', className)}
    {...props}
  >
    <NavigationMenu.Root>
      <NavigationMenu.List className="flex items-center justify-start md:justify-center md:space-x-7">
        <NavigationMenu.Item>
          <NavigationMenu.Link href="/product" className="hidden transition-colors hover:text-gray-400 md:block">
            Product
          </NavigationMenu.Link>
        </NavigationMenu.Item>
        <NavigationMenu.Item>
          <NavigationMenu.Link href="/blog" className="hidden transition-colors hover:text-gray-400 md:block">
            Blog
          </NavigationMenu.Link>
        </NavigationMenu.Item>
        <NavigationMenu.Item>
          <NavigationMenu.Link href="/" className="text-lg font-bold uppercase tracking-wide">
            Shio.dev
          </NavigationMenu.Link>
        </NavigationMenu.Item>
        <NavigationMenu.Item>
          <NavigationMenu.Link href="/about" className="hidden transition-colors hover:text-gray-400 md:block">
            About
          </NavigationMenu.Link>
        </NavigationMenu.Item>
        <NavigationMenu.Item>
          <NavigationMenu.Link href="/skill" className="hidden transition-colors hover:text-gray-400 md:block">
            Skill
          </NavigationMenu.Link>
        </NavigationMenu.Item>
      </NavigationMenu.List>
    </NavigationMenu.Root>
    <div className="block md:hidden">
      <HamburgerMenu iconSize={32} />
    </div>
  </header>
);
