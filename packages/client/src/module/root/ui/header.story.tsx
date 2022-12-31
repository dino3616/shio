import type { ComponentStoryObj, ComponentMeta } from '@storybook/react';
import { RecoilRoot } from 'recoil';

import { Header } from './header.layout';

type Story = ComponentStoryObj<typeof Header>;

const meta: ComponentMeta<typeof Header> = {
  component: Header,
  decorators: [(story) => <RecoilRoot>{story()}</RecoilRoot>],
  argTypes: {
    className: {
      description: 'class to inject.',
      control: { type: 'text' },
    },
  },
};

export default meta;

export const Default: Story = {};
