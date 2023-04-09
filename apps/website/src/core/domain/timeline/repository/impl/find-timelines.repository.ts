'use client';

import type { FindTimelinesRepositoryInterface } from '@/core/domain/timeline/repository/find-timelines.repository';
import { FindTimelinesDocument, FindTimelinesQuery, FindTimelinesQueryVariables } from '@/core/infra/graphql/generated/graphql';
import { urqlClient } from '@/core/infra/urql/urql.service';

export const findTimelinesRepository: FindTimelinesRepositoryInterface = async (input, inject) => {
  const { data, error } = await urqlClient
    .query<FindTimelinesQuery, FindTimelinesQueryVariables>(FindTimelinesDocument, input, { requestPolicy: 'cache-and-network' })
    .toPromise();

  if (data?.findTimelines === undefined || error) {
    throw error || new Error(`An error occurred while ${findTimelinesRepository.name}.`);
  }

  return data.findTimelines;
};
