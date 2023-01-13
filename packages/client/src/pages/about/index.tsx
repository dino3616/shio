import type { NextPage } from 'next';
import { Outline } from '@/module/about/ui/outline.page';
import { Layout } from '@/module/layout/ui/layout.page';

const AboutPage: NextPage = () => (
  <Layout title="About | shio.dev" className="space-y-5 py-10 px-5 md:px-10">
    <Outline />
  </Layout>
);

export default AboutPage;
