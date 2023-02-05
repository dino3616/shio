import type { GetStaticProps, NextPage } from 'next';
import { formatDate } from '@/infra/date/date.service';
import { SortOrder } from '@/infra/graphql/generated/graphql';
import { Layout } from '@/module/layout/ui/layout.page';
import type { Timeline as TimelineModel } from '@/module/me/model/timeline.model';
import { findTimelines } from '@/module/me/repository/find-timelines.repository';
import { Hero } from '@/module/me/ui/hero.page';
import { Timeline } from '@/module/me/ui/timeline.page';

export type RootPageProps = {
  timelines: TimelineModel[];
};

const RootPage: NextPage<RootPageProps> = ({ timelines }: RootPageProps) => (
  <Layout title="shio.dev | Creator for Creators" className="py-10 px-5 pt-0 md:px-10">
    <Hero className="h-[calc(100vh_-_4.75rem)]" />
    <Timeline timelines={timelines} timelineCardProps={{ formatDate }} />
  </Layout>
);

export const getStaticProps: GetStaticProps<RootPageProps> = async () => {
  const timelines = await findTimelines({ orderBy: { happenedAt: SortOrder.Asc } });

  return {
    props: {
      timelines: JSON.parse(JSON.stringify(timelines)),
    },
    revalidate: 20,
  };
};

export default RootPage;
