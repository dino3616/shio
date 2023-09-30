'use client';

import { cn } from '@shio/tailwind';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { TypeAnimation } from 'react-type-animation';

export type CodeBoxProps = Omit<ComponentPropsWithoutRef<'div'>, 'children' | 'className'> & {
  outsideClass?: ComponentPropsWithoutRef<'div'>['className'];
};

export const CodeBox = ({ outsideClass, ...props }: CodeBoxProps): ReactNode => (
  <div
    data-theme="dark"
    style={{
      colorScheme: 'dark',
    }}
    className={cn('relative mb-5 mr-5', outsideClass)}
    {...props}
  >
    <div className="max-w-[50vw] overflow-auto rounded-3xl bg-blue-3 px-10 py-5 font-code text-mauve-12 tablet:text-xl">
      <code>$ shio --introduce</code>
      <pre>
        <code className="flex flex-col">
          <span className="text-yellow-11">Hi, my name is shio!🧂</span>
          <span className="text-green-11">
            <TypeAnimation
              sequence={[
                "I'm a novelist 🖋",
                1000,
                "I'm a illustrator 🎨",
                1000,
                "I'm a musician 🎸",
                1000,
                "I'm a programmer 🛠",
                1000,
                "I'm a creator for creators ✨",
                2000,
              ]}
              speed={50}
              repeat={Infinity}
              cursor
            />
          </span>
          <span>- National Institute of Technology, Ibaraki College</span>
          <span>- Synthetic Speech Otaku</span>
          <span> - VOCALOID -&gt; Hatsune Miku, Yuzuki Yukari</span>
          <span> - SynthV -&gt; Koharu Rikka, Yamine Renri</span>
          <span> - CeVIO -&gt; Kafu</span>
          <span> - Gynoid -&gt; flower, Meika Hime, Meika Mikoto</span>
          <span> - and more...</span>
          <span>- Rustacean 🦀</span>
        </code>
      </pre>
    </div>
    <div aria-hidden className="absolute left-5 top-5 -z-10 h-full w-full rounded-3xl bg-gradient-to-r from-purple-9 to-blue-9" />
  </div>
);
