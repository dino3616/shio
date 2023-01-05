import type { ComponentStoryObj, ComponentMeta } from '@storybook/react';

import { SnsList } from './sns-list.page';

type Story = ComponentStoryObj<typeof SnsList>;

const meta: ComponentMeta<typeof SnsList> = {
  component: SnsList,
  argTypes: {
    className: {
      description: 'class to inject.',
      control: { type: 'text' },
    },
  },
};

export default meta;

export const Default: Story = {};
