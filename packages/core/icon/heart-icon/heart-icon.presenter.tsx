import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { BsHeartFill } from 'react-icons/bs';

type HeartIconProps = Omit<ComponentPropsWithoutRef<'svg'>, 'children'>;

export const HeartIcon = ({ ...props }: HeartIconProps): ReactNode => <BsHeartFill {...props} />;
