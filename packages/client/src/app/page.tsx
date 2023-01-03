'use client';

import type { FC } from 'react';
import { formatDate } from '@/infra/date/date.service';
import { findTimelines } from '@/module/root/repository/find-timelines.repository';
import { Hero } from '@/module/root/ui/hero.page';
import { Timeline } from '@/module/root/ui/timeline.page';

const RootPage: FC = () => (
  <div className="px-10">
    <Hero className="h-[calc(100vh_-_76px)]" />
    <Timeline timelinesFinder={findTimelines} dateFormatter={formatDate} />
  </div>
);

export default RootPage;
