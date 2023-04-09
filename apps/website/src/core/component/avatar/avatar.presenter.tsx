import { ComponentPropsWithRef, forwardRef, ForwardRefExoticComponent } from 'react';
import { Image } from '@/core/component/image';
import { twMerge } from '@/core/util/tw-merge.util';

type AvatarProps = Omit<ComponentPropsWithRef<typeof Image>, 'src' | 'alt' | 'width' | 'height' | 'children'> & {
  size: Required<Pick<ComponentPropsWithRef<typeof Image>, 'width'>>['width'];
};

export const Avatar: ForwardRefExoticComponent<AvatarProps> = forwardRef<HTMLImageElement | null, Omit<AvatarProps, 'ref'>>(
  ({ size, className, ...props }, ref) => (
    <Image
      ref={ref}
      priority
      src="/favicon.png"
      alt="avatar"
      width={size}
      height={size}
      className={twMerge('rounded-[2.0rem]', className)}
      {...props}
    />
  ),
);

Avatar.displayName = 'Avatar';
