import type { ComponentPropsWithoutRef, FC } from 'react';
import { Footer } from './component/footer/footer.presenter';
import { Header } from './component/header/header.presenter';
import { Meta, MetaProps } from './component/meta/meta.presenter';

export type LayoutProps = ComponentPropsWithoutRef<'main'> & Pick<MetaProps, 'title'>;

export const Layout: FC<LayoutProps> = ({ title, children, ...props }) => (
  <>
    <Meta title={title} />
    <Header className="sticky top-0 left-0 grow-0" />
    <main className="min-h-full grow" {...props}>
      {children}
    </main>
    <Footer className="grow-0" />
  </>
);
