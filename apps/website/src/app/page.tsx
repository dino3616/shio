import type { Metadata } from 'next';
import { findTimelinesRepository } from '@/core/domain/timeline/repository/impl/find-timelines.repository';
import { formatDate } from '@/core/infra/date/date.service';
import { SortOrder } from '@/core/infra/graphql/generated/graphql';
import { urqlClient } from '@/core/infra/urql/urql.service';
import { Timeline } from '@/module/me/ui/timeline.page';

const RootPage = async (): Promise<JSX.Element | null> => {
  const timelines = await findTimelinesRepository({
    orderBy: {
      happenedAt: SortOrder.Asc,
    },
  });

  return <Timeline timelines={timelines} timelineCardProps={{ formatDate }} />;
};

export default RootPage;

export const revalidate = 20;

export const generateMetadata = async (): Promise<Metadata> => {
  const metadata: Metadata = {
    title: 'shio.studio',
    description: 'Portfolio site of shio, creator for creators.',
    viewport: {
      width: 'device-width',
      initialScale: 1.0,
    },
    icons: '/favicon.ico',
    openGraph: {
      type: 'website',
      url: `https://${process.env['NEXT_PUBLIC_HOSTNAME']}`,
      images: `https://${process.env['NEXT_PUBLIC_HOSTNAME']}/ogp.png`,
    },
    twitter: {
      card: 'summary_large_image',
      site: '@shio3616',
    },
  };

  return metadata;
};
