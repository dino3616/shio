import type { ComponentStoryObj, ComponentMeta } from '@storybook/react';
import { Header } from './header.presenter';

type Story = ComponentStoryObj<typeof Header>;

const meta: ComponentMeta<typeof Header> = {
  component: Header,
  argTypes: {
    className: {
      description: 'class to inject.',
      control: { type: 'text' },
    },
  },
};

export default meta;

export const Default: Story = {};
