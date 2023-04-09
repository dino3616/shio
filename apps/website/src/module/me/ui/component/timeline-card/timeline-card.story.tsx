import type { ComponentStoryObj, ComponentMeta } from '@storybook/react';
import { TimelineCard } from './timeline-card.presenter';

type Story = ComponentStoryObj<typeof TimelineCard>;

const meta: ComponentMeta<typeof TimelineCard> = {
  component: TimelineCard,
  argTypes: {
    timeline: {
      description: 'Timeline of events. A property `date` is automatically formatted.',
      control: { type: 'object' },
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
