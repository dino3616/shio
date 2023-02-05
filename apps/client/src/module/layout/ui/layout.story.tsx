import type { ComponentStoryObj, ComponentMeta } from '@storybook/react';
import { Layout } from './layout.page';

type Story = ComponentStoryObj<typeof Layout>;

const meta: ComponentMeta<typeof Layout> = {
  component: Layout,
  argTypes: {
    title: {
      description: 'page title.',
      control: {
        type: 'text',
      },
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
    title: 'shio.dev | Creator for Creators',
  },
};
