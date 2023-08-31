import type { Meta, StoryObj } from '@storybook/react';
import { DiamondIcon } from './diamond-icon.presenter';

type Story = StoryObj<typeof DiamondIcon>;

const meta = {
  component: DiamondIcon,
  argTypes: {},
} satisfies Meta<typeof DiamondIcon>;

export default meta;

export const Default: Story = {};
