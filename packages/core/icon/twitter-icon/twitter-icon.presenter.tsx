import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { BsTwitter } from 'react-icons/bs';

type TwitterIconProps = Omit<ComponentPropsWithoutRef<'svg'>, 'children'>;

export const TwitterIcon = ({ ...props }: TwitterIconProps): ReactNode => <BsTwitter {...props} />;
