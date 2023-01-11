import type { Timeline } from '../model/timeline.model';
import { FindTimelinesDocument, FindTimelinesQuery, FindTimelinesQueryVariables } from '@/infra/graphql/generated/graphql';
import { urqlClient } from '@/infra/urql/urql.service';

export type FindTimelinesInterface = (variables: FindTimelinesQueryVariables) => Promise<Timeline[]>;

export const findTimelines: FindTimelinesInterface = async (variables) => {
  const { data, error } = await urqlClient
    .query<FindTimelinesQuery, FindTimelinesQueryVariables>(FindTimelinesDocument, variables, { requestPolicy: 'cache-and-network' })
    .toPromise();

  if (data?.findTimelines === undefined || error) {
    throw error || new Error(`An error occurred while ${findTimelines.name}.`);
  }

  return data.findTimelines;
};
