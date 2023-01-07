import type { FC } from 'react';
import { formatDate } from '@/infra/date/date.service';
import { Layout } from '@/module/layout/ui/layout.page';
import { useFindTimelines } from '@/module/root/repository/find-timelines.repository';
import { Hero } from '@/module/root/ui/hero.page';
import { Timeline } from '@/module/root/ui/timeline.page';

const RootPage: FC = () => (
  <Layout title="shio.dev | Creator for Creators" className="py-10 px-5 pt-0 md:px-10">
    <Hero className="h-[calc(100vh_-_4.75rem)]" />
    <Timeline
      foundTimelinesProps={{
        useFindTimelines,
        formatDate,
      }}
    />
  </Layout>
);

export default RootPage;
