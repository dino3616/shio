'use client';

import type { FC } from 'react';
import { formatDate } from '@/infra/date/date.service';
import { useFindTimelines } from '@/module/root/repository/find-timelines.repository';
import { Hero } from '@/module/root/ui/hero.page';
import { Timeline } from '@/module/root/ui/timeline.page';

const RootPage: FC = () => {
  const timelines = useFindTimelines();

  if (timelines === null) {
    return null;
  }

  return (
    <div className="px-10">
      <Hero className="h-[calc(100vh_-_76px)]" />
      {timelines === undefined ? (
        <Timeline
          timelines={[
            {
              id: '1',
              title: 'loading...',
              happenedAt: new Date('1970-01-01T00:00:00.000Z'),
            },
          ]}
          dateFormatter={() => ''}
        />
      ) : (
        <Timeline timelines={timelines} dateFormatter={formatDate} />
      )}
    </div>
  );
};

export default RootPage;
