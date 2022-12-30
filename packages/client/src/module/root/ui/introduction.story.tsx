import type { ComponentStoryObj, ComponentMeta } from '@storybook/react';

import { Introduction } from './introduction.page';

type Story = ComponentStoryObj<typeof Introduction>;

const meta: ComponentMeta<typeof Introduction> = {
  component: Introduction,
  argTypes: {
    className: {
      control: { type: 'text' },
    },
  },
};

export default meta;

export const Default: Story = {};
