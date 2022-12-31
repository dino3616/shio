'use client';

import type { FC } from 'react';
import { useHeaderHeight } from '@/common/state/header.state';
import { Hero } from '@/module/root/ui/hero.page';
import { Timeline } from '@/module/root/ui/timeline.page';
import { useOptimizeHeroHeight } from '@/module/root/use-case/optimize-hero-height.use-case';

const RootPage: FC = () => {
  const headerHeight = useHeaderHeight();
  const heroRef = useOptimizeHeroHeight<HTMLDivElement>(headerHeight);

  return (
    <div className="px-10">
      <Hero ref={heroRef} />
      <Timeline />
    </div>
  );
};

export default RootPage;
