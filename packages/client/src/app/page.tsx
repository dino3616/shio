'use client';

import type { FC } from 'react';
import { formatDate } from '@/infra/date/date.service';
import { useFindTimelines } from '@/module/root/repository/find-timelines.repository';
import { Hero } from '@/module/root/ui/hero.page';
import { Timeline } from '@/module/root/ui/timeline.page';

const RootPage: FC = () => (
  <div className="p-10 pt-0">
    <Hero className="h-[calc(100vh_-_4.75rem)]" />
    <Timeline
      foundTimelinesProps={{
        useFindTimelines,
        formatDate,
      }}
    />
  </div>
);

export default RootPage;
