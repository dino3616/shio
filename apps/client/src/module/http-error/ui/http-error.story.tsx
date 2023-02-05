import type { ComponentStoryObj, ComponentMeta } from '@storybook/react';
import { HttpError } from './http-error.page';

type Story = ComponentStoryObj<typeof HttpError>;

const meta: ComponentMeta<typeof HttpError> = {
  component: HttpError,
  argTypes: {
    title: {
      description: 'error title to display.',
      control: {
        type: 'text',
      },
    },
    message: {
      description: 'error message to display',
      control: {
        type: 'text',
      },
    },
    className: {
      description: 'class to inject.',
      control: { type: 'text' },
    },
  },
};

export default meta;

export const Default: Story = {
  args: {
    title: '404 | Not Found',
    message: 'The page you are looking for does not exist.',
  },
};
