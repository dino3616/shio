import type { ComponentStoryObj, ComponentMeta } from '@storybook/react';
import { Hero } from './hero.page';

type Story = ComponentStoryObj<typeof Hero>;

const meta: ComponentMeta<typeof Hero> = {
  component: Hero,
  argTypes: {
    className: {
      description: 'class to inject.',
      control: { type: 'text' },
    },
  },
};

export default meta;

export const Default: Story = {};
