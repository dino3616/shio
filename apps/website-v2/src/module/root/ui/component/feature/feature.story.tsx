import type { Meta, StoryObj } from '@storybook/react';
import { jobs } from '@/module/root/constant/job';
import { Feature } from './feature.presenter';

type Story = StoryObj<typeof Feature>;

const meta = {
  component: Feature,
  argTypes: {
    featureLabel: {
      description: 'The label of the feature.',
      control: {
        type: 'text',
      },
    },
    featureDescription: {
      description: 'The description of the feature.',
      control: {
        type: 'text',
      },
    },
    icon: {
      description: 'The icon component of the feature.',
      control: {
        type: 'object',
      },
    },
    imageSrc: {
      description: 'The source of the feature image.',
      control: {
        type: 'object',
      },
    },
    imageAlt: {
      description: 'The alt text of the feature image.',
      control: {
        type: 'text',
      },
    },
    reverse: {
      description: 'Whether to reverse the position of text and image.',
      control: {
        type: 'boolean',
      },
    },
  },
} satisfies Meta<typeof Feature>;

export default meta;

export const Default: Story = {
  args: {
    featureLabel: jobs['frontend-engineer'].features[0].label,
    featureDescription: jobs['frontend-engineer'].features[0].description,
    icon: jobs['frontend-engineer'].features[0].icon,
    imageSrc: jobs['frontend-engineer'].features[0].imageSrc,
    imageAlt: jobs['frontend-engineer'].features[0].imageAlt,
  },
};

export const Reverse: Story = {
  args: {
    featureLabel: jobs['frontend-engineer'].features[0].label,
    featureDescription: jobs['frontend-engineer'].features[0].description,
    icon: jobs['frontend-engineer'].features[0].icon,
    imageSrc: jobs['frontend-engineer'].features[0].imageSrc,
    imageAlt: jobs['frontend-engineer'].features[0].imageAlt,
    reverse: true,
  },
};
