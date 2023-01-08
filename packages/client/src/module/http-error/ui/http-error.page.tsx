import Image from 'next/image';
import type { ComponentPropsWithoutRef, FC } from 'react';
import { twMerge } from '@/common/util/tw-merge.util';

export type HttpErrorProps = Omit<ComponentPropsWithoutRef<'div'>, 'children'> & {
  title: string;
  message: string;
};

export const HttpError: FC<HttpErrorProps> = ({ title, message, className, ...props }) => (
  <div className={twMerge('flex items-center gap-24', className)} {...props}>
    <Image src="/http-error.svg" alt="avatar" width={320} height={320} />
    <div>
      <h1 className="font-rakkas text-5xl">{title}</h1>
      <p className="text-lg">{message}</p>
    </div>
  </div>
);
