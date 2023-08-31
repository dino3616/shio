import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './button.presenter';

type Story = StoryObj<typeof Button>;

const meta: Meta<typeof Button> = {
  component: Button,
  argTypes: {
    color: {
      description: 'The background color and text color of the button.',
      control: {
        type: 'select',
        options: ['mauve', 'purple'],
      },
    },
    textColor: {
      description: 'The text color of the button.',
      control: {
        type: 'select',
        options: ['mauve', 'accent-mauve', 'purple', 'accent-purple'],
      },
    },
    border: {
      description: 'The border color of the button.',
      control: {
        type: 'select',
        options: ['purple', 'gradient-pink-purple'],
      },
    },
    fontWeight: {
      description: 'The font weight of the button text.',
      control: {
        type: 'select',
        options: ['normal', 'bold'],
      },
    },
  },
};

export default meta;

export const Default: Story = {
  render: () => <Button>Button</Button>,
};
