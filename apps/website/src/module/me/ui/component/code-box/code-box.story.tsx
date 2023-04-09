import type { ComponentStoryObj, ComponentMeta } from '@storybook/react';
import { CodeBox } from './code-box.presenter';

type Story = ComponentStoryObj<typeof CodeBox>;

const meta: ComponentMeta<typeof CodeBox> = {
  component: CodeBox,
  argTypes: {},
};

export default meta;

export const Default: Story = {};
