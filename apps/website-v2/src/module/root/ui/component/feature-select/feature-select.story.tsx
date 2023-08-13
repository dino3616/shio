import type { Meta, StoryObj } from '@storybook/react';
import { FeatureSelect } from './feature-select.presenter';

type Story = StoryObj<typeof FeatureSelect>;

const meta = {
  component: FeatureSelect,
  argTypes: {
    selectedFeature: {
      description: 'The currently selected feature.',
      control: {
        type: 'select',
        options: ['feature-1', 'feature-2', 'feature-3'],
      },
    },
    onFeatureChange: {
      description: 'The callback to invoke when the selected feature changes.',
      action: 'onFeatureChange',
    },
    features: {
      description: 'The list of features to choose from.',
      control: {
        type: 'array',
        options: ['feature-1', 'feature-2', 'feature-3'],
      },
    },
  },
} satisfies Meta<typeof FeatureSelect>;

export default meta;

export const Default: Story = {
  args: {
    selectedFeature: 'feature-1',
    features: ['feature-1', 'feature-2', 'feature-3'],
  },
};
