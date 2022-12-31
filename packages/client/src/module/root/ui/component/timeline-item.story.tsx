import type { ComponentStoryObj, ComponentMeta } from '@storybook/react';

import { TimelineItem } from './timeline-item.presenter';

type Story = ComponentStoryObj<typeof TimelineItem>;

const meta: ComponentMeta<typeof TimelineItem> = {
  component: TimelineItem,
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
      event: 'some event',
      date: '1970/01/01',
    },
  },
};
