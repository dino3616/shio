import { Image } from '#core/component/image';
import BrandShioImage from '@shio/core/asset/brand/icon.webp';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { CodeBox } from '#website-v1/module/root/ui/component/code-box';

type HeroSectionProps = Omit<ComponentPropsWithoutRef<'section'>, 'children' | 'className'>;

export const HeroSection = ({ ...props }: HeroSectionProps): ReactNode => (
  <section className="relative flex h-[100svh] items-center justify-center gap-10 px-5 pt-[76px] tablet:px-20" {...props}>
    <div className="flex max-w-lg flex-col items-center gap-10 laptop:shrink-0">
      <Image src={BrandShioImage} width={128} height={128} alt="A brand icon for shio." className="h-32 w-32 rounded-3xl drop-shadow-xl" />
      <h1 className="font-rakkas text-5xl underline">Shio</h1>
      <p className="text-lg font-bold text-mauve-11">フロント・バックエンドエンジニア。クリエイターのためのクリエイターになることを夢見てる。</p>
    </div>
    <CodeBox outsideClass="hidden laptop:block" />
  </section>
);
