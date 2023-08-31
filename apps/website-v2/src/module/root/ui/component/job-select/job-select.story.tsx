import type { Meta, StoryObj } from '@storybook/react';
import { JobSelect } from './job-select.presenter';

type Story = StoryObj<typeof JobSelect>;

const meta = {
  component: JobSelect,
  argTypes: {
    selectedJobLabel: {
      description: 'The currently selected job.',
      control: {
        type: 'select',
        options: ['frontend-engineer', 'designer'],
      },
    },
    onJobLabelChange: {
      description: 'The callback to invoke when the selected job changes.',
      action: 'onJobChange',
    },
  },
} satisfies Meta<typeof JobSelect>;

export default meta;

export const Default: Story = {
  args: {
    selectedJobLabel: 'frontend-engineer',
  },
};
