import type { ComponentStoryObj, ComponentMeta } from '@storybook/react';
import { LearningLevel } from '../model/learning-level.model';
import { Skill } from './skill.page';

type Story = ComponentStoryObj<typeof Skill>;

const meta: ComponentMeta<typeof Skill> = {
  component: Skill,
  argTypes: {
    skills: {
      description: 'skills to display',
      control: { type: 'object' },
    },
    className: {
      description: 'class to inject.',
      control: { type: 'text' },
    },
  },
};

export default meta;

export const Default: Story = {
  args: {
    skills: [
      {
        id: '1',
        name: 'StoryBook',
        description: 'UI component dev & test: React, Vue, Angular',
        learningLevel: LearningLevel.Beginner,
        officialUrl: 'https://storybook.js.org/',
        iconUrl: 'https://raw.githubusercontent.com/gilbarbara/logos/1f372be75689d73cae89b6de808149b606b879e1/logos/storybook-icon.svg',
      },
      {
        id: '1',
        name: 'StoryBook',
        description: 'UI component dev & test: React, Vue, Angular',
        learningLevel: LearningLevel.Advanced,
        officialUrl: 'https://storybook.js.org/',
        iconUrl: 'https://raw.githubusercontent.com/gilbarbara/logos/1f372be75689d73cae89b6de808149b606b879e1/logos/storybook-icon.svg',
      },
    ],
  },
};
