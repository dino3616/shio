import type { ComponentStoryObj, ComponentMeta } from '@storybook/react';
import { Heading } from './heading.presenter';

type Story = ComponentStoryObj<typeof Heading>;

const meta: ComponentMeta<typeof Heading> = {
  component: Heading,
  argTypes: {
    text: {
      description: 'Main text.',
      control: { type: 'text' },
    },
    alt: {
      description: 'Sub text.',
      control: { type: 'text' },
    },
  },
};

export default meta;

export const Default: Story = {
  args: {
    text: 'Heading',
    alt: 'ヘディング',
  },
};
