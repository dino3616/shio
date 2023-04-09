import type { Client as UrqlClient } from 'urql';
import type { Timeline } from '@/core/domain/timeline/model/timeline.model';
import type { FindTimelinesQueryVariables } from '@/core/infra/graphql/generated/graphql';

export type FindTimelinesRepositoryInject = void;

export type FindTimelinesRepositoryInput = FindTimelinesQueryVariables;

export type FindTimelinesRepositoryOutput = Timeline[];

export type FindTimelinesRepositoryInterface = (
  input: FindTimelinesRepositoryInput,
  inject: FindTimelinesRepositoryInject,
) => Promise<FindTimelinesRepositoryOutput>;
