import type { ComponentStoryObj, ComponentMeta } from '@storybook/react';

import { Avatar } from './avatar.presenter';

type Story = ComponentStoryObj<typeof Avatar>;

const meta: ComponentMeta<typeof Avatar> = {
  component: Avatar,
  argTypes: {
    className: {
      control: { type: 'text' },
    },
  },
};

export default meta;

export const Default: Story = {
  args: {
    size: 120,
  },
};
