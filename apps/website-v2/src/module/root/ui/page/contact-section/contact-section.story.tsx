import type { Meta, StoryObj } from '@storybook/react';
import { ContactSection } from './contact-section.presenter';

type Story = StoryObj<typeof ContactSection>;

const meta = {
  component: ContactSection,
  argTypes: {},
} satisfies Meta<typeof ContactSection>;

export default meta;

export const Default: Story = {};
