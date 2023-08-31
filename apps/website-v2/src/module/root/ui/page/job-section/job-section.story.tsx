import type { Meta, StoryObj } from '@storybook/react';
import { JobSection } from './job-section.presenter';

type Story = StoryObj<typeof JobSection>;

const meta = {
  component: JobSection,
  argTypes: {},
} satisfies Meta<typeof JobSection>;

export default meta;

export const Default: Story = {};
