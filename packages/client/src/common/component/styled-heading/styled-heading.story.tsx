import type { ComponentStoryObj, ComponentMeta } from '@storybook/react';

import { StyledHeading } from './styled-heading.presenter';

type Story = ComponentStoryObj<typeof StyledHeading>;

const meta: ComponentMeta<typeof StyledHeading> = {
  component: StyledHeading,
  argTypes: {
    text: {
      description: 'main text.',
      control: { type: 'text' },
    },
    alt: {
      description: 'sub text.',
      control: { type: 'text' },
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
    text: 'Heading',
    alt: 'ヘディング',
  },
};
