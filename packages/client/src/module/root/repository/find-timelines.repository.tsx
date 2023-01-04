import type { Timeline } from '../domain/timeline/model/timeline.model';
import { useFindTimelinesQuery } from '@/infra/graphql/generated/graphql';

export type UseFindTimelinesInterface = () => Timeline[];

export const useFindTimelines: UseFindTimelinesInterface = () => {
  const [{ data, error }] = useFindTimelinesQuery({
    requestPolicy: 'cache-and-network',
  });

  if (data?.findTimelines === undefined || error) {
    throw error || new Error(`An error occurred while '${useFindTimelines.name}'.`);
  }

  return data.findTimelines;
};
