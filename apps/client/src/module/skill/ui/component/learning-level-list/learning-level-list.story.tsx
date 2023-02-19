import type { ComponentStoryObj, ComponentMeta } from '@storybook/react';
import { useState } from 'react';
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

export const Default: Story = {
  render: (args) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [isExpanded, setIsExpanded] = useState(true);

    return <LearningLevelList {...args} expantionController={{ isExpanded, setIsExpanded }} />;
  },
};
