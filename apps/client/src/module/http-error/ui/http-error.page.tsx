import type { ComponentPropsWithoutRef, FC } from 'react';
import { Image } from '@/common/component/image/image.presenter';
import { twMerge } from '@/common/util/tw-merge.util';

export type HttpErrorProps = Omit<ComponentPropsWithoutRef<'div'>, 'children'> & {
  title: string;
  message: string;
};

export const HttpError: FC<HttpErrorProps> = ({ title, message, className, ...props }) => (
  <div className={twMerge('relative flex items-center gap-24', className)} {...props}>
    <Image src="/http-error.svg" alt="avatar" width={320} height={320} />
    <div className="absolute mx-5 rounded-xl border-2 border-white/40 bg-white/10 px-5 py-7 drop-shadow-lg backdrop-blur-lg md:static md:mx-0">
      <h1 className="font-rakkas text-5xl">{title}</h1>
      <p className="text-lg">{message}</p>
    </div>
  </div>
);
