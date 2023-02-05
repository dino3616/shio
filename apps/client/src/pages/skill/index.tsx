import type { GetStaticProps, NextPage } from 'next';
import { SortOrder } from '@/infra/graphql/generated/graphql';
import { Layout } from '@/module/layout/ui/layout.page';
import type { Skill as SkillModel } from '@/module/skill/model/skill.model';
import { findSkills } from '@/module/skill/repository/find-skills.repository';
import { Skill } from '@/module/skill/ui/skill.page';

export type SkillPageProps = {
  skills: SkillModel[];
};

const SkillPage: NextPage<SkillPageProps> = ({ skills }: SkillPageProps) => (
  <Layout title="Skill | shio.dev" className="py-10 px-5 md:px-10">
    <Skill skills={skills} />
  </Layout>
);

export const getStaticProps: GetStaticProps<SkillPageProps> = async () => {
  const skills = await findSkills({ orderBy: { index: SortOrder.Asc } });

  return {
    props: {
      skills: JSON.parse(JSON.stringify(skills)),
    },
    revalidate: 20,
  };
};

export default SkillPage;
