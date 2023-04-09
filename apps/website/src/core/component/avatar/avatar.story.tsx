import type { ComponentStoryObj, ComponentMeta } from '@storybook/react';
import { Avatar } from './avatar.presenter';

type Story = ComponentStoryObj<typeof Avatar>;

const meta: ComponentMeta<typeof Avatar> = {
  component: Avatar,
  argTypes: {
    size: {
      description: 'Summarizes the height and width properties of next/image.',
      control: { type: 'range', min: 0, max: 255, step: 5 },
    },
  },
};

export default meta;

export const Default: Story = {
  args: {
    size: 120,
  },
};
