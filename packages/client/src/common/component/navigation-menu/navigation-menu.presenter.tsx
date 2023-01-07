import * as RadixUiNavigationMenu from '@radix-ui/react-navigation-menu';
import NextLink from 'next/link';
import type { ComponentPropsWithoutRef, FC } from 'react';

type LinkProps = ComponentPropsWithoutRef<typeof NextLink>;

const Link: FC<LinkProps> = ({ children, ...props }) => (
  <RadixUiNavigationMenu.Link asChild>
    <NextLink {...props}>{children}</NextLink>
  </RadixUiNavigationMenu.Link>
);

export const NavigationMenu = { ...RadixUiNavigationMenu, Link };
