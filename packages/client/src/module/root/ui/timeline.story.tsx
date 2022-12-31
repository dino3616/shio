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

export const Default: Story = {};
