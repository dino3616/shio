import type { ComponentStoryObj, ComponentMeta } from '@storybook/react';
import { SiStorybook } from 'react-icons/si';
import { Button } from './button.presenter';

type Story = ComponentStoryObj<typeof Button>;

const meta: ComponentMeta<typeof Button> = {
  component: Button,
  argTypes: {
    asIcon: {
      description: 'Render as icon.',
      control: { type: 'boolean' },
    },
    disableHoverAnimation: {
      description: 'Disable hover animation',
      control: { type: 'boolean' },
    },
    disableTapAnimation: {
      description: 'Disable click animation',
      control: { type: 'boolean' },
    },
  },
};

export default meta;

export const Default: Story = {
  render: (args) => <Button {...args}>Button</Button>,
};

export const WithIcon: Story = {
  render: (args) => (
    <Button className="rounded-full" {...args}>
      <SiStorybook className="text-pink-500" size={30} />
      <span className="font-semibold">StoryBook</span>
    </Button>
  ),
};

export const Circle: Story = {
  render: (args) => (
    <Button className="rounded-full" {...args}>
      <SiStorybook className="text-pink-500" size={120} />
    </Button>
  ),
};

export const AsIcon: Story = {
  render: (args) => (
    <Button asIcon {...args}>
      <SiStorybook className="text-pink-500" size={120} />
    </Button>
  ),
};
