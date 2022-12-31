import { ComponentPropsWithRef, FC, forwardRef } from 'react';
import { CodeBox } from './component/code-box.presenter';
import { Avatar } from '@/common/component/avatar/avatar.presenter';
import { twMerge } from '@/util/tw-merge';

export type HeroProps = Omit<ComponentPropsWithRef<'div'>, 'children'>;

export const Hero: FC<HeroProps> = forwardRef<HTMLDivElement, HeroProps>(({ className, ...props }, ref) => (
  <div ref={ref} className={twMerge('flex items-center justify-center gap-10', className)} {...props}>
    <div className="flex max-w-lg flex-col items-center space-y-10">
      <Avatar size={120} />
      <h1 className="font-rakkas text-5xl underline">Shio</h1>
      <p className="font-rakkas text-lg font-semibold">フロント・バックエンドエンジニア。クリエイターのクリエイターになることを夢見てる。</p>
    </div>
    <CodeBox className="hidden lg:block" />
  </div>
));

Hero.displayName = 'Hero';
