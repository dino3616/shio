import { FindTimelinesDocument, FindTimelinesQuery, FindTimelinesQueryVariables } from '@/infra/graphql/generated/graphql';
import { urqlClient } from '@/infra/urql/urql.service';
import type { Timeline } from '@/model/timeline.model';

export type FindTimelinesResult = Promise<Timeline[]>;

export const findTimelines = async (): FindTimelinesResult => {
  const { data, error } = await urqlClient
    .query<FindTimelinesQuery, FindTimelinesQueryVariables>(FindTimelinesDocument, {}, { requestPolicy: 'cache-and-network' })
    .toPromise();

  if (data?.findTimelines === undefined || error) {
    throw error || new Error('An error occurred while `findTimelines()`.');
  }

  return data.findTimelines;
};
