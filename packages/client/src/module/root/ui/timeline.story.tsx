import type { ComponentStoryObj, ComponentMeta } from '@storybook/react';

import { Timeline } from './timeline.page';

type Story = ComponentStoryObj<typeof Timeline>;

const meta: ComponentMeta<typeof Timeline> = {
  component: Timeline,
  argTypes: {
    className: {
      description: 'class to inject.',
      control: { type: 'text' },
    },
  },
};

export default meta;

export const Default: Story = {
  args: {
    timelinesFinder: async () => [
      {
        id: 'abc-123',
        title: 'hoge event',
        happenedAt: new Date('1970/01/01'),
      },
      {
        id: 'abc-456',
        title: 'fuga event',
        happenedAt: new Date('1970/01/01'),
      },
    ],
    dateFormatter: () => 'Jan. 01 1970',
  },
};
