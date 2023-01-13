import type { ComponentPropsWithoutRef, FC } from 'react';
import { SnsList } from './component/sns-list/sns-list.page';
import { twMerge } from '@/common/util/tw-merge.util';

export type OutlineProps = Omit<ComponentPropsWithoutRef<'div'>, 'children'>;

export const Outline: FC<OutlineProps> = ({ className, ...props }) => (
  <div className={twMerge('space-y-5', className)} {...props}>
    <div className="space-y-10 border-b-2 border-gray-400 pb-10">
      <div className="flex justify-between" {...props}>
        <div className="font-bold">
          <div className="text-2xl font-bold md:text-4xl">シオ</div>
          <div className="text-5xl font-bold md:text-7xl">Shio🧂</div>
        </div>
        <div className="hidden border-l-4 border-primary pl-5 text-lg font-semibold text-gray-500 md:flex md:flex-col md:justify-center">
          <div>Front-end Engineer</div>
          <div>Back-end Engineer</div>
          <div>Project Manager</div>
        </div>
      </div>
      <p className="text-lg">
        フロントエンド・バックエンドエンジニア。
        <br />
        NITIC在籍。
        <br />
        クリエイターのためのクリエイターになることが夢。
        <br />
        チーム開発のノウハウは未だお勉強中。
      </p>
    </div>
    <SnsList className="flex justify-end" />
  </div>
);
