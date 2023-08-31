import type { Meta, StoryObj } from '@storybook/react';
import { HeroSection } from './hero-section.presenter';

type Story = StoryObj<typeof HeroSection>;

const meta = {
  component: HeroSection,
  argTypes: {
    onAboutMeButtonClick: {
      description: 'A callback function to be called when the about me button is clicked.',
      action: 'onAboutMeButtonClick',
    },
  },
} satisfies Meta<typeof HeroSection>;

export default meta;

export const Default: Story = {};
