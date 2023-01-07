import type { ComponentStoryObj, ComponentMeta } from '@storybook/react';
import { Footer } from './footer.presenter';

type Story = ComponentStoryObj<typeof Footer>;

const meta: ComponentMeta<typeof Footer> = {
  component: Footer,
  argTypes: {
    className: {
      description: 'class to inject.',
      control: { type: 'text' },
    },
  },
};

export default meta;

export const Default: Story = {};
