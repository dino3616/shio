import type { Meta, StoryObj } from '@storybook/react';
import { HeartIcon } from './heart-icon.presenter';

type Story = StoryObj<typeof HeartIcon>;

const meta = {
  component: HeartIcon,
  argTypes: {},
} satisfies Meta<typeof HeartIcon>;

export default meta;

export const Default: Story = {};
