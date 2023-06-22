import type { ComponentPropsWithoutRef, ReactNode } from 'react';

type FooterProps = Omit<ComponentPropsWithoutRef<'footer'>, 'children'>;

export const Footer = ({ ...props }: FooterProps): ReactNode => <footer {...props} />;
