import type { Meta, StoryObj } from '@storybook/react';
import { LinkButton } from './link-button.presenter';

type Story = StoryObj<typeof LinkButton>;

const meta: Meta<typeof LinkButton> = {
  component: LinkButton,
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
  render: () => <LinkButton href="/">Link Button</LinkButton>,
};
