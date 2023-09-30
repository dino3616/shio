import BrandShioImage from '@shio/core/asset/brand/icon.webp';
import { Image } from '@shio/core/component/image';
import { cn } from '@shio/tailwind';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';

type FooterProps = Omit<ComponentPropsWithoutRef<'footer'>, 'children' | 'className'> & {
  outsideClass?: ComponentPropsWithoutRef<'footer'>['className'];
};

export const Footer = ({ outsideClass, ...props }: FooterProps): ReactNode => (
  <footer
    className={cn('flex flex-col items-center justify-center gap-10 bg-dark-purple-9 py-10 text-purple-12 dark:bg-purple-5', outsideClass)}
    {...props}
  >
    <div className="flex flex-wrap-reverse items-center justify-center gap-5">
      <p className="text-5xl font-bold">shio.studio</p>
      <Image src={BrandShioImage} width={128} height={128} alt="A brand icon for shio." className="h-32 w-32 rounded-3xl drop-shadow-xl" />
    </div>
    <small className="font-bold">Copyright &copy; shio all right reserved.</small>
  </footer>
);
