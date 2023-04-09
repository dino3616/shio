import NextLink from 'next/link';
import { ComponentPropsWithoutRef, FC, forwardRef } from 'react';

type LinkProps = ComponentPropsWithoutRef<typeof NextLink>;

export const Link: FC<LinkProps> = forwardRef<HTMLAnchorElement, LinkProps>(({ children, ...props }, ref) => (
  <NextLink ref={ref} scroll={false} {...props}>
    {children}
  </NextLink>
));

Link.displayName = 'Link';
