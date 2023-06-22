import type { Meta, StoryObj } from '@storybook/react';
import { Switch } from './switch.presenter';

type Story = StoryObj<typeof Switch.Root>;

const meta: Meta<typeof Switch.Root> = {
  component: Switch.Root,
  argTypes: {},
};

export default meta;

export const Default: Story = {
  render: () => (
    <Switch.Root className="w-20 rounded-full bg-mauve-3 p-2 shadow-inner" id="airplane-mode">
      <Switch.Thumb className="block h-6 w-6 rounded-full bg-mauve-12 shadow-lg transition duration-100 data-[state='checked']:translate-x-10" />
    </Switch.Root>
  ),
};
