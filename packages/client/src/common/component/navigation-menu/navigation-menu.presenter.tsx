import * as RadixUiNavigationMenu from '@radix-ui/react-navigation-menu';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import type { ComponentPropsWithoutRef, FC } from 'react';

type LinkProps = ComponentPropsWithoutRef<typeof RadixUiNavigationMenu.Link> & {
  href: string;
};

const Link: FC<LinkProps> = ({ href, ...props }) => {
  const router = useRouter();
  const isActive = router.asPath === href;

  return (
    <NextLink href={href} passHref>
      <RadixUiNavigationMenu.Link active={isActive} {...props} />
    </NextLink>
  );
};

export const NavigationMenu = { ...RadixUiNavigationMenu, Link };
