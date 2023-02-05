import type { Skill } from '../model/skill.model';
import { FindSkillsDocument, FindSkillsQuery, FindSkillsQueryVariables } from '@/infra/graphql/generated/graphql';
import { urqlClient } from '@/infra/urql/urql.service';

export type FindSkillsInterface = (variables: FindSkillsQueryVariables) => Promise<Skill[]>;

export const findSkills: FindSkillsInterface = async (variables) => {
  const { data, error } = await urqlClient
    .query<FindSkillsQuery, FindSkillsQueryVariables>(FindSkillsDocument, variables, { requestPolicy: 'cache-and-network' })
    .toPromise();

  if (data?.findSkills === undefined || error) {
    throw error || new Error(`An error occurred while ${findSkills.name}.`);
  }

  return data.findSkills;
};
