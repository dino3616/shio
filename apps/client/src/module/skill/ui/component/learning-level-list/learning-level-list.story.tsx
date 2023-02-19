import type { ComponentStoryObj, ComponentMeta } from '@storybook/react';
import { LearningLevelList } from './learning-level-list.presenter';

type Story = ComponentStoryObj<typeof LearningLevelList>;

const meta: ComponentMeta<typeof LearningLevelList> = {
  component: LearningLevelList,
  argTypes: {
    expantionController: {
      description: 'setter and value for expantion.',
      control: { type: 'object' },
    },
  },
};

export default meta;

export const Default: Story = {};
