import type { ComponentStoryObj, ComponentMeta } from '@storybook/react';

import { StyledHeading } from './styled-heading.presenter';

type Story = ComponentStoryObj<typeof StyledHeading>;

const meta: ComponentMeta<typeof StyledHeading> = {
  component: StyledHeading,
  argTypes: {
    className: {
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
