import type { Meta, StoryObj } from '@storybook/react';
import { FeatureSection } from './feature-section.presenter';

type Story = StoryObj<typeof FeatureSection>;

const meta = {
  component: FeatureSection,
  argTypes: {},
} satisfies Meta<typeof FeatureSection>;

export default meta;

export const Default: Story = {};
