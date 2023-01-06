import * as RadixUiNavigationMenu from '@radix-ui/react-navigation-menu';
import NextLink from 'next/link';
import type { ComponentPropsWithoutRef, FC } from 'react';

export type LinkProps = ComponentPropsWithoutRef<typeof RadixUiNavigationMenu.Link> & {
  href: string;
  isActive: boolean;
};

export const Link: FC<LinkProps> = ({ href, isActive, ...props }) => (
  <NextLink href={href} passHref>
    <RadixUiNavigationMenu.Link active={isActive} {...props} />
  </NextLink>
);
