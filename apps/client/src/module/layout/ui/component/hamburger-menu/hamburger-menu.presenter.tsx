import { motion } from 'framer-motion';
import type { ComponentPropsWithoutRef, Dispatch, FC, SetStateAction } from 'react';
import { FaHamburger } from 'react-icons/fa';
import type { IconBaseProps } from 'react-icons/lib';
import { Button } from '@/common/component/button/button.presenter';
import { Dialog } from '@/common/component/dialog/dialog.presenter';
import { Link } from '@/common/component/link/link.presenter';
import { NavigationMenu } from '@/common/component/navigation-menu/navigation-menu.presenter';

export type HamburgerMenuProps = Omit<ComponentPropsWithoutRef<typeof Dialog.Root>, 'children'> & {
  iconSize: Required<IconBaseProps['size']>;
  dialogController?: {
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
    toClose: () => void;
  };
};

export const HamburgerMenu: FC<HamburgerMenuProps> = ({ iconSize, dialogController, ...props }) => (
  <Dialog.Root open={dialogController?.open} onOpenChange={dialogController?.setOpen} {...props}>
    <Dialog.Trigger asChild>
      <Button asIcon>
        <FaHamburger size={iconSize} />
      </Button>
    </Dialog.Trigger>
    <Dialog.Portal>
      <Dialog.Content className="fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2">
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1.0 }}
          exit={{ scale: 0.8 }}
          className="space-y-7 rounded-xl border-2 border-white/40 bg-white/10 px-5 py-7 drop-shadow-lg backdrop-blur-lg"
        >
          <Dialog.Title className="mx-5 text-5xl font-bold">
            <Link href="/" onClick={dialogController?.toClose}>
              shio.dev
            </Link>
          </Dialog.Title>
          <NavigationMenu.Root>
            <NavigationMenu.List className="flex flex-col items-center justify-center space-y-5 text-2xl font-semibold underline">
              <NavigationMenu.Item>
                <NavigationMenu.Link href="/product" onClick={dialogController?.toClose}>
                  Product
                </NavigationMenu.Link>
              </NavigationMenu.Item>
              <NavigationMenu.Item>
                <NavigationMenu.Link href="/blog" onClick={dialogController?.toClose}>
                  Blog
                </NavigationMenu.Link>
              </NavigationMenu.Item>
              <NavigationMenu.Item>
                <NavigationMenu.Link href="/about" onClick={dialogController?.toClose}>
                  About
                </NavigationMenu.Link>
              </NavigationMenu.Item>
              <NavigationMenu.Item>
                <NavigationMenu.Link href="/skill" onClick={dialogController?.toClose}>
                  Skill
                </NavigationMenu.Link>
              </NavigationMenu.Item>
            </NavigationMenu.List>
          </NavigationMenu.Root>
        </motion.div>
      </Dialog.Content>
    </Dialog.Portal>
  </Dialog.Root>
);
