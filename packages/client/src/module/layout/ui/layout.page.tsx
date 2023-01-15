import { motion } from 'framer-motion';
import type { ComponentPropsWithoutRef, FC } from 'react';
import { Footer } from './component/footer/footer.presenter';
import { Header } from './component/header/header.presenter';
import { Meta, MetaProps } from './component/meta/meta.container';
import { twMerge } from '@/common/util/tw-merge.util';

export type LayoutProps = ComponentPropsWithoutRef<typeof motion.main> & Pick<MetaProps, 'title'>;

export const Layout: FC<LayoutProps> = ({ title, className, children, ...props }) => (
  <>
    <Meta title={title} />
    <Header className="sticky top-0 left-0 grow-0" />
    <motion.main initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className={twMerge('min-h-full grow', className)} {...props}>
      {children}
    </motion.main>
    <Footer className="grow-0" />
  </>
);
