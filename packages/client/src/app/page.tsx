'use client';

import type { FC } from 'react';
import { useHeaderHeight } from '@/common/state/header.state';
import { formatDate } from '@/infra/date/date.service';
import { useFindTimelines } from '@/module/root/repository/find-timelines.repository';
import { Hero } from '@/module/root/ui/hero.page';
import { Timeline } from '@/module/root/ui/timeline.page';
import { useOptimizeHeroHeight } from '@/module/root/use-case/optimize-hero-height.use-case';

const RootPage: FC = () => {
  const headerHeight = useHeaderHeight();
  const heroRef = useOptimizeHeroHeight<HTMLDivElement>(headerHeight);
  const timelines = useFindTimelines();

  if (timelines === undefined) {
    return null;
  }
  if (timelines === null) {
    return null;
  }

  return (
    <div className="px-10">
      <Hero ref={heroRef} />
      <Timeline timelines={timelines} dateFormatter={formatDate} />
    </div>
  );
};

export default RootPage;
