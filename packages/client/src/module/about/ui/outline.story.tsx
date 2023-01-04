import type { ComponentStoryObj, ComponentMeta } from '@storybook/react';

import { Outline } from './outline.page';

type Story = ComponentStoryObj<typeof Outline>;

const meta: ComponentMeta<typeof Outline> = {
  component: Outline,
  argTypes: {
    className: {
      description: 'class to inject.',
      control: { type: 'text' },
    },
  },
};

export default meta;

export const Default: Story = {};
