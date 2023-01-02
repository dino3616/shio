import { useFindTimelinesQuery } from '@/infra/graphql/generated/graphql';
import type { Timeline } from '@/model/timeline.model';

export type UseFindTimelinesResult = Array<Timeline> | null | undefined;

export const useFindTimelines = (): UseFindTimelinesResult => {
  const [{ data, fetching, error }] = useFindTimelinesQuery({
    requestPolicy: 'cache-and-network',
  });

  if (fetching) {
    return undefined;
  }
  if (!fetching && !error && data) {
    return data.findTimelines;
  }

  return null;
};
