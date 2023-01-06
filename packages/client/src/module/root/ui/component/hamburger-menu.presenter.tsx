import Link from 'next/link';
import type { ComponentPropsWithoutRef, FC } from 'react';
import { FaHamburger } from 'react-icons/fa';
import type { IconBaseProps } from 'react-icons/lib';
import { Button } from '@/common/component/button/button.presenter';
import { Dialog } from '@/common/component/dialog/dialog.presenter';

export type HamburgerMenuProps = Omit<ComponentPropsWithoutRef<typeof Dialog.Root>, 'children'> & {
  iconSize: Required<IconBaseProps['size']>;
};

export const HamburgerMenu: FC<HamburgerMenuProps> = ({ iconSize, ...props }) => (
  <Dialog.Root {...props}>
    <Dialog.Trigger asChild>
      <Button asIcon>
        <FaHamburger size={iconSize} />
      </Button>
    </Dialog.Trigger>
    <Dialog.Portal>
      <Dialog.Overlay className="fixed inset-0 bg-gray-500/40" />
      <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 space-y-7 rounded-xl border-2 border-white/40 bg-white/10 px-5 py-7 drop-shadow-lg backdrop-blur-lg">
        <Dialog.Title className="mx-5 text-5xl font-bold">shio.dev</Dialog.Title>
        <nav>
          <ul className="flex flex-col items-center justify-center space-y-5 text-2xl font-semibold underline">
            <li>
              <Link href="/product">Product</Link>
            </li>
            <li>
              <Link href="/blog">Blog</Link>
            </li>
            <li>
              <Link href="/about">About</Link>
            </li>
            <li>
              <Link href="/skill">Skill</Link>
            </li>
          </ul>
        </nav>
      </Dialog.Content>
    </Dialog.Portal>
  </Dialog.Root>
);
