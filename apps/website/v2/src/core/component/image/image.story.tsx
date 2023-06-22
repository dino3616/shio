import type { Meta, StoryObj } from '@storybook/react';
import { Image } from './image.presenter';
import OpenGraphImage from '@/app/opengraph-image.png';

type Story = StoryObj<typeof Image>;

const meta: Meta<typeof Image> = {
  component: Image,
  argTypes: {},
};

export default meta;

export const Default: Story = {
  args: {
    src: OpenGraphImage,
    alt: 'An open graph image of this website.',
  },
};
