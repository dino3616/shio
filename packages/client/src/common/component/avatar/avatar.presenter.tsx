import Image, { ImageProps } from 'next/image';
import type { FC } from 'react';
import { twMerge } from '@/common/util/tw-merge.util';

export type AvatarProps = Omit<ImageProps, 'children' | 'src' | 'alt' | 'width' | 'height'> & {
  size: Required<Pick<ImageProps, 'width'>>['width'];
};

export const Avatar: FC<AvatarProps> = ({ size, className, ...props }) => (
  <Image priority src="/favicon.png" alt="avatar" width={size} height={size} className={twMerge('rounded-[2.0rem]', className)} {...props} />
);
