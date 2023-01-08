import type { ComponentStoryObj, ComponentMeta } from '@storybook/react';
import { Timeline } from './timeline.presenter';

type Story = ComponentStoryObj<typeof Timeline>;

const meta: ComponentMeta<typeof Timeline> = {
  component: Timeline,
  argTypes: {
    timeline: {
      description: 'timeline of events. `date` is automatically formatted.',
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
    timeline: {
      id: 'abc-123',
      title: 'some event',
      happenedAt: new Date('1970/01/01'),
    },
    formatDate: () => 'Jan. 01, 1970',
  },
};
