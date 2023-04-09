import type { ComponentStoryObj, ComponentMeta } from '@storybook/react';
import { ScrollRevealAnimation } from './scroll-reveal-animation.presenter';
import { Card } from '@/core/component/card';

type Story = ComponentStoryObj<typeof ScrollRevealAnimation>;

const meta: ComponentMeta<typeof ScrollRevealAnimation> = {
  component: ScrollRevealAnimation,
  argTypes: {
    once: {
      description: 'Whether to animate only once.',
      control: { type: 'boolean' },
    },
    duration: {
      description: 'Seconds to animate.',
      control: { type: 'range', min: 0, max: 20, step: 0.1 },
    },
    delay: {
      description: 'Seconds to wait animation.',
      control: { type: 'range', min: 0, max: 32, step: 1 },
    },
    distance: {
      description: 'Pixel to move.',
      control: { type: 'text' },
    },
  },
};

export default meta;

export const Default: Story = {
  args: {
    duration: 0.8,
    delay: 0,
    distance: '40px',
  },
  render: (args) => (
    <ScrollRevealAnimation {...args}>
      <Card>
        あのイーハトーヴォのすきとおった風、夏でも底に冷たさをもつ青いそら、うつくしい森で飾られたモリーオ市、郊外のぎらぎらひかる草の波。
        <br />
        またそのなかでいっしょになったたくさんのひとたち、ファゼーロとロザーロ、羊飼のミーロや、顔の赤いこどもたち、地主のテーモ、山猫博士のボーガント・デストゥパーゴなど、いまこの暗い巨きな石の建物のなかで考えていると、みんなむかし風のなつかしい青い幻燈のように思われます。では、わたくしはいつかの小さなみだしをつけながら、しずかにあの年のイーハトーヴォの五月から十月までを書きつけましょう。
      </Card>
    </ScrollRevealAnimation>
  ),
};
