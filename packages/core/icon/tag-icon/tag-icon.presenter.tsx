import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { AiFillTags } from 'react-icons/ai';

type TagIconProps = Omit<ComponentPropsWithoutRef<'svg'>, 'children'>;

export const TagIcon = ({ ...props }: TagIconProps): ReactNode => <AiFillTags {...props} />;
