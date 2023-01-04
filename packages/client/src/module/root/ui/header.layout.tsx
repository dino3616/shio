'use client';

import Link from 'next/link';
import { ComponentPropsWithoutRef, FC, useEffect, useRef } from 'react';
import { useSetHeaderRef } from '@/common/state/header.state';
import { twMerge } from '@/util/tw-merge';

export type HeaderProps = Omit<ComponentPropsWithoutRef<'header'>, 'children'>;

export const Header: FC<HeaderProps> = ({ className, ...props }) => {
  const ref = useRef<HTMLElement>(null);
  const setHeaderRef = useSetHeaderRef();

  useEffect(() => {
    setHeaderRef(ref);
  }, [ref, setHeaderRef]);

  return (
    <header ref={ref} className={twMerge('z-50 bg-white py-6 font-inter shadow-lg', className)} {...props}>
      <ul className="flex items-center justify-center space-x-7">
        <li>
          <Link href="/product" className="transition-colors hover:text-gray-400">
            Product
          </Link>
        </li>
        <li>
          <Link href="/blog" className="transition-colors hover:text-gray-400">
            Blog
          </Link>
        </li>
        <li>
          <Link href="/" className="text-lg font-semibold uppercase tracking-wide">
            Shio.dev
          </Link>
        </li>
        <li>
          <Link href="/about" className="transition-colors hover:text-gray-400">
            About
          </Link>
        </li>
        <li>
          <Link href="/skill" className="transition-colors hover:text-gray-400">
            Skill
          </Link>
        </li>
      </ul>
    </header>
  );
};
