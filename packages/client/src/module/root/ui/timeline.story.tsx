import type { ComponentStoryObj, ComponentMeta } from '@storybook/react';
import { use } from 'react';
import { DiProvider, injectable } from 'react-magnetic-di';
import { Timeline } from './timeline.page';
import type { Timeline as TimelineModel } from '@/model/timeline.model';

type Story = ComponentStoryObj<typeof Timeline>;

const injectHooks = () => [
  injectable<typeof use<TimelineModel[]>>(use, () => [
    {
      id: 'abc-123',
      title: 'hoge event',
      happenedAt: new Date('1970/01/01'),
    },
    {
      id: 'abc-456',
      title: 'fuga event',
      happenedAt: new Date('1970/01/01'),
    },
  ]),
];

const meta: ComponentMeta<typeof Timeline> = {
  component: Timeline,
  decorators: [(story) => <DiProvider use={injectHooks()}>{story()}</DiProvider>],
  argTypes: {
    className: {
      description: 'class to inject.',
      control: { type: 'text' },
    },
  },
};

export default meta;

export const Default: Story = {
  args: {
    timelinesFinder: async () => [
      {
        id: 'abc-123',
        title: 'hoge event',
        happenedAt: new Date('1970/01/01'),
      },
      {
        id: 'abc-456',
        title: 'fuga event',
        happenedAt: new Date('1970/01/01'),
      },
    ],
    dateFormatter: () => 'Jan. 01 1970',
  },
};
