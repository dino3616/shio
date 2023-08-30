import type { Meta, StoryObj } from '@storybook/react';
import BrandIconImage from '#core/asset/brand/icon.webp';
import { Image } from './image.presenter';

type Story = StoryObj<typeof Image>;

const meta: Meta<typeof Image> = {
  component: Image,
  argTypes: {},
};

export default meta;

export const Default: Story = {
  args: {
    src: BrandIconImage,
    alt: 'The brand icon of this website.',
    width: 640,
    height: 640,
  },
};
