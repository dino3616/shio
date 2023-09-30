import type { Meta, StoryObj } from '@storybook/react';
import { CodeBox } from './code-box.presenter';

type Story = StoryObj<typeof CodeBox>;

const meta = {
  component: CodeBox,
  argTypes: {},
} satisfies Meta<typeof CodeBox>;

export default meta;

export const Default: Story = {};
