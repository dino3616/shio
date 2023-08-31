import type { Meta, StoryObj } from '@storybook/react';
import { TimerIcon } from './timer-icon.presenter';

type Story = StoryObj<typeof TimerIcon>;

const meta = {
  component: TimerIcon,
  argTypes: {},
} satisfies Meta<typeof TimerIcon>;

export default meta;

export const Default: Story = {};
