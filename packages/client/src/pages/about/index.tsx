import type { FC } from 'react';
import { Outline } from '@/module/about/ui/outline.page';
import { SnsList } from '@/module/about/ui/sns-list.page';
import { Layout } from '@/module/layout/ui/layout.page';

const AboutPage: FC = () => (
  <Layout title="About | shio.dev" className="space-y-5 py-10 px-5 md:px-10">
    <Outline className="border-b-2 border-gray-400 pb-10" />
    <SnsList className="flex justify-end" />
  </Layout>
);

export default AboutPage;
