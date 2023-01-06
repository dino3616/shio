import Link from 'next/link';
import type { ComponentPropsWithoutRef, FC } from 'react';
import { HamburgerMenu } from './component/hamburger-menu.presenter';
import { twMerge } from '@/common/util/tw-merge.util';

export type HeaderProps = Omit<ComponentPropsWithoutRef<'header'>, 'children'>;

export const Header: FC<HeaderProps> = ({ className, ...props }) => (
  <header
    className={twMerge('z-50 bg-white py-6 px-5 font-inter shadow-lg justify-between md:justify-center flex items-center', className)}
    {...props}
  >
    <nav>
      <ul className="flex items-center justify-start md:justify-center md:space-x-7">
        <li>
          <Link href="/product" className="hidden transition-colors hover:text-gray-400 md:block">
            Product
          </Link>
        </li>
        <li>
          <Link href="/blog" className="hidden transition-colors hover:text-gray-400 md:block">
            Blog
          </Link>
        </li>
        <li>
          <Link href="/" className="text-lg font-bold uppercase tracking-wide">
            Shio.dev
          </Link>
        </li>
        <li>
          <Link href="/about" className="hidden transition-colors hover:text-gray-400 md:block">
            About
          </Link>
        </li>
        <li>
          <Link href="/skill" className="hidden transition-colors hover:text-gray-400 md:block">
            Skill
          </Link>
        </li>
      </ul>
    </nav>
    <div className="block md:hidden">
      <HamburgerMenu iconSize={32} />
    </div>
  </header>
);
