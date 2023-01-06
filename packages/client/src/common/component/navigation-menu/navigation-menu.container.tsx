'use client';

import * as RadixUiNavigationMenu from '@radix-ui/react-navigation-menu';
import { usePathname } from 'next/navigation';
import type { ComponentPropsWithoutRef, FC } from 'react';
import { Link as LinkPresenter } from './navigation-menu.presenter';

type LinkProps = ComponentPropsWithoutRef<typeof RadixUiNavigationMenu.Link> & {
  href: string;
};

const Link: FC<LinkProps> = ({ href, ...props }) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return <LinkPresenter href={href} isActive={isActive} {...props} />;
};

export const NavigationMenu = { ...RadixUiNavigationMenu, Link };
