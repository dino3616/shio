'use client';

import type { FC } from 'react';
import { formatDate } from '@/infra/date/date.service';
import { useFindTimelines } from '@/module/root/repository/find-timelines.repository';
import { Hero } from '@/module/root/ui/hero.page';
import { Timeline } from '@/module/root/ui/timeline.page';

const RootPage: FC = () => {
  const timelines = useFindTimelines();

  if (timelines === undefined) {
    return null;
  }
  if (timelines === null) {
    return null;
  }

  return (
    <div className="px-10">
      <Hero className="h-[calc(100vh_-_76px)]" />
      <Timeline timelines={timelines} dateFormatter={formatDate} />
    </div>
  );
};

export default RootPage;
