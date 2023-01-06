import type { ComponentStoryObj, ComponentMeta } from '@storybook/react';

import { HamburgerMenu } from './hamburger-menu.presenter';
import { Avatar } from '@/common/component/avatar/avatar.presenter';

type Story = ComponentStoryObj<typeof HamburgerMenu>;

const meta: ComponentMeta<typeof HamburgerMenu> = {
  component: HamburgerMenu,
};

export default meta;

export const Default: Story = {};

export const WithBackground: Story = {
  render: (args) => (
    <>
      <HamburgerMenu {...args} />
      <Avatar size={400} className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" />
    </>
  ),
};
