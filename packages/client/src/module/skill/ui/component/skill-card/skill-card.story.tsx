import type { ComponentStoryObj, ComponentMeta } from '@storybook/react';
import { SkillCard } from './skill-card.presenter';
import { LearningLevel } from '@/module/skill/model/learning-level.model';

type Story = ComponentStoryObj<typeof SkillCard>;

const meta: ComponentMeta<typeof SkillCard> = {
  component: SkillCard,
};

export default meta;

export const Default: Story = {
  args: {
    skill: {
      id: '1',
      name: 'StoryBook',
      description: 'UI component dev & test: React, Vue, Angular',
      learningLevel: LearningLevel.Beginner,
      officialUrl: 'https://storybook.js.org/',
      iconUrl: 'https://raw.githubusercontent.com/gilbarbara/logos/1f372be75689d73cae89b6de808149b606b879e1/logos/storybook-icon.svg',
    },
  },
};
