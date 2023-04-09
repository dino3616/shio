import type { ComponentPropsWithoutRef, FC } from 'react';
import { TypeAnimation } from 'react-type-animation';
import { Link } from '@/core/component/link/link.presenter';
import { twMerge } from '@/core/util/tw-merge.util';

type CodeBoxProps = Omit<ComponentPropsWithoutRef<typeof Link>, 'href' | 'target' | 'children'>;

export const CodeBox: FC<CodeBoxProps> = ({ className, ...props }) => (
  <Link
    href="https://github.com/dino3616/shio/tree/main/packages/cli"
    target="_blank"
    className={twMerge('relative flex h-fit w-fit mb-5 mr-5', className)}
    {...props}
  >
    <div className="font-code bg-gray-700 rounded-3xl py-5 px-10 text-left transition hover:-translate-y-1 hover:-translate-x-1 active:translate-y-5 active:translate-x-5">
      <div className="text-info-100 md:text-xl">
        <pre>
          <code>$ shio --introduce</code>
        </pre>
        <pre className="text-caution">
          <code>Hi, my name is shio!🧂</code>
        </pre>
        <pre className="text-success">
          <code>
            <TypeAnimation
              sequence={[
                "I'm a novelist🖋.",
                1000,
                "I'm a illustrator🎨.",
                1000,
                "I'm a musician🎸.",
                1000,
                "I'm a programmer🛠.",
                1000,
                "I'm a creator for creators✨.",
                2000,
              ]}
              speed={50}
              repeat={Infinity}
              cursor
            />
          </code>
        </pre>
        <pre>
          <code>- National Institute of Technology, Ibaraki College</code>
        </pre>
        <pre>
          <code>- Synthetic Speech Otaku</code>
        </pre>
        <pre>
          <code> - VOCALOID -&gt; Hatsune Miku, Yuzuki Yukari</code>
        </pre>
        <pre>
          <code> - SynthV -&gt; Koharu Rikka, Yamine Renri</code>
        </pre>
        <pre>
          <code> - CeVIO -&gt; Kafu</code>
        </pre>
        <pre>
          <code> - Gynoid -&gt; flower, Meika Hime, Meika Mikoto</code>
        </pre>
        <pre>
          <code> - and more...</code>
        </pre>
        <pre>
          <code>- Rustacean🦀</code>
        </pre>
      </div>
    </div>
    <div className="gradient-cosmic absolute top-5 left-5 -z-10 h-full w-full rounded-3xl bg-gradient-to-r" aria-hidden />
  </Link>
);
