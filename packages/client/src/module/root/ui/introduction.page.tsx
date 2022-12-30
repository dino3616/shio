import type { ComponentPropsWithoutRef, FC } from 'react';
import { CodeBox } from './component/code-box.presenter';
import { Avatar } from '@/common/component/avatar/avatar.presenter';
import { twMerge } from '@/util/tw-merge';

export type IntroductionProps = Omit<ComponentPropsWithoutRef<'div'>, 'children'>;

export const Introduction: FC<IntroductionProps> = ({ className, ...props }) => (
  <div className={twMerge('flex justify-center', className)} {...props}>
    <div className="flex flex-col items-center space-y-10 px-5">
      <Avatar size={120} />
      <h1 className="font-rakkas text-5xl underline">Shio</h1>
      <p className="text-lg font-semibold">フロント・バックエンドエンジニア。クリエイターのクリエイターになることを夢見てる。</p>
    </div>
    <CodeBox className="hidden lg:block" />
  </div>
);
