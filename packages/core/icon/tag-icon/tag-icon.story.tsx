import type { Meta, StoryObj } from '@storybook/react';
import { TagIcon } from './tag-icon.presenter';

type Story = StoryObj<typeof TagIcon>;

const meta = {
  component: TagIcon,
  argTypes: {},
} satisfies Meta<typeof TagIcon>;

export default meta;

export const Default: Story = {};
