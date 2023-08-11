import type { Meta, StoryObj } from '@storybook/react';
import { ProfileSection } from './profile-section.presenter';

type Story = StoryObj<typeof ProfileSection>;

const meta = {
  component: ProfileSection,
  argTypes: {},
} satisfies Meta<typeof ProfileSection>;

export default meta;

export const Default: Story = {};
