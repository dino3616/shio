import { FindTimelinesDocument, FindTimelinesQuery, FindTimelinesQueryVariables, Timeline } from '@/infra/graphql/generated/graphql';
import { urqlClient } from '@/infra/urql/urql.service';

export type FindTimelinesInterface = () => Promise<Timeline[]>;

export const findTimelines: FindTimelinesInterface = async () => {
  const { data, error } = await urqlClient
    .query<FindTimelinesQuery, FindTimelinesQueryVariables>(FindTimelinesDocument, {}, { requestPolicy: 'cache-and-network' })
    .toPromise();

  if (data?.findTimelines === undefined || error) {
    throw error || new Error('An error occurred while `findTimelines()`.');
  }

  return data.findTimelines;
};
