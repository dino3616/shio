import type { ComponentStoryObj, ComponentMeta } from '@storybook/react';

import { CodeBox } from './code-box.presenter';

type Story = ComponentStoryObj<typeof CodeBox>;

const meta: ComponentMeta<typeof CodeBox> = {
  component: CodeBox,
  argTypes: {
    className: {
      control: { type: 'text' },
    },
  },
};

export default meta;

export const Default: Story = {};
