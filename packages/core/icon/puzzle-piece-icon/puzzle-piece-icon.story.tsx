import type { Meta, StoryObj } from '@storybook/react';
import { PuzzlePieceIcon } from './puzzle-piece-icon.presenter';

type Story = StoryObj<typeof PuzzlePieceIcon>;

const meta = {
  component: PuzzlePieceIcon,
  argTypes: {},
} satisfies Meta<typeof PuzzlePieceIcon>;

export default meta;

export const Default: Story = {};
