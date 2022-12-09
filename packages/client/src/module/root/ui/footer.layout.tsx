import Image from 'next/image';
import type { ComponentPropsWithoutRef, FC } from 'react';
import { twMerge } from '@/util/tw-merge';

export type FooterProps = Omit<ComponentPropsWithoutRef<'footer'>, 'children'>;

export const Footer: FC<FooterProps> = ({ className, ...props }) => (
  <footer className={twMerge('flex flex-col items-center justify-center space-y-10 bg-accent py-10 text-primary-800', className)} {...props}>
    <div className="flex items-center space-x-5">
      <span className="text-5xl font-semibold">Shio.dev</span>
      <Image src="/favicon.png" alt="avatar" width={120} height={120} className="rounded-[2.0rem]" />
    </div>
    <small className="font-semibold">Copyright &copy; shio all right reserved.</small>
  </footer>
);
