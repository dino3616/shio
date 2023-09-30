import { Link } from '@shio/core/component/link';
import { cn } from '@shio/tailwind';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';

export type HeaderProps = Omit<ComponentPropsWithoutRef<'header'>, 'children' | 'className'> & {
  outsideClass?: ComponentPropsWithoutRef<'header'>['className'];
};

export const Header = ({ outsideClass, ...props }: HeaderProps): ReactNode => (
  <header className={cn('flex w-full items-center justify-center bg-mauve-1 p-6 shadow-lg', outsideClass)} {...props}>
    <nav aria-label="main navigation" className="flex items-center justify-center gap-6 font-inter laptop:gap-12">
      <Link href="/" className="text-lg font-bold uppercase tracking-wide">
        shio.studio
      </Link>
    </nav>
  </header>
);
