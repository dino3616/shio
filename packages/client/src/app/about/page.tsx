import type { FC } from 'react';
import { Outline } from '@/module/about/ui/outline.page';
import { SnsList } from '@/module/about/ui/sns-list.page';

const AboutPage: FC = () => (
  <div className="space-y-5 p-10">
    <Outline className="border-b-2 border-gray-400 pb-10" />
    <SnsList className="flex justify-end" />
  </div>
);

export default AboutPage;
