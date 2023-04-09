import * as RadixUiNavigationMenu from '@radix-ui/react-navigation-menu';
import { ComponentPropsWithRef, forwardRef, ForwardRefExoticComponent } from 'react';
import { Link as PrimitiveLink } from '@/core/component/link/link.presenter';

type LinkProps = ComponentPropsWithRef<typeof PrimitiveLink>;

const Link: ForwardRefExoticComponent<LinkProps> = forwardRef<HTMLAnchorElement, Omit<LinkProps, 'ref'>>(({ children, ...props }, ref) => (
  <RadixUiNavigationMenu.Link ref={ref} asChild>
    <PrimitiveLink {...props}>{children}</PrimitiveLink>
  </RadixUiNavigationMenu.Link>
));

Link.displayName = 'Link';

export const NavigationMenu = { ...RadixUiNavigationMenu, Link };
