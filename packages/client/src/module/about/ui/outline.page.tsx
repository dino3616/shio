import type { ComponentPropsWithoutRef, FC } from 'react';
import { twMerge } from '@/common/util/tw-merge.util';

export type OutlineProps = Omit<ComponentPropsWithoutRef<'div'>, 'children'>;

export const Outline: FC<OutlineProps> = ({ className, ...props }) => (
  <div className={twMerge('space-y-10', className)}>
    <div className="flex justify-between" {...props}>
      <div className="font-bold">
        <div className="text-2xl font-bold md:text-4xl">ã·ãª</div>
        <div className="text-5xl font-bold md:text-7xl">Shioð§</div>
      </div>
      <div className="hidden border-l-4 border-primary pl-5 text-lg font-semibold text-gray-500 md:flex md:flex-col md:justify-center">
        <div>Front-end Engineer</div>
        <div>Back-end Engineer</div>
        <div>Project Manager</div>
      </div>
    </div>
    <p className="text-lg">
      ãã­ã³ãã¨ã³ãã»ããã¯ã¨ã³ãã¨ã³ã¸ãã¢ã
      <br />
      NITICå¨ç±ã
      <br />
      ã¯ãªã¨ã¤ã¿ã¼ã®ããã®ã¯ãªã¨ã¤ã¿ã¼ã«ãªããã¨ãå¤¢ã
      <br />
      ãã¼ã éçºã®ãã¦ãã¦ã¯æªã ãåå¼·ä¸­ã
    </p>
  </div>
);
