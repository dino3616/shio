import type { ComponentPropsWithRef, FC } from 'react';
import { CodeBox } from './component/code-box/code-box.presenter';
import { Avatar } from '@/common/component/avatar/avatar.presenter';
import { twMerge } from '@/common/util/tw-merge.util';

export type HeroProps = Omit<ComponentPropsWithRef<'div'>, 'children'>;

export const Hero: FC<HeroProps> = ({ className, ...props }) => (
  <div className={twMerge('flex items-center justify-center gap-10', className)} {...props}>
    <div className="flex max-w-lg flex-col items-center space-y-10">
      <Avatar size={120} className="drop-shadow-xl" />
      <h1 className="font-rakkas text-5xl underline">Shio</h1>
      <p className="font-rakkas text-lg font-semibold">フロント・バックエンドエンジニア。クリエイターのクリエイターになることを夢見てる。</p>
    </div>
    <CodeBox className="hidden lg:block" />
  </div>
);

Hero.displayName = 'Hero';
