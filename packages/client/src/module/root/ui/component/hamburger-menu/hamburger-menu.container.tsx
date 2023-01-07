'use client';

import { ComponentPropsWithoutRef, FC, useState } from 'react';
import { HamburgerMenu as HamburgerMenuPresenter } from './hamburger-menu.presenter';

export type HamburgerMenuProps = Omit<ComponentPropsWithoutRef<typeof HamburgerMenuPresenter>, 'modalController'>;

export const HamburgerMenu: FC<HamburgerMenuProps> = ({ ...props }) => {
  const [open, setOpen] = useState(false);

  return (
    <HamburgerMenuPresenter
      modalController={{
        open,
        setOpen,
        toClose: () => setOpen(false),
      }}
      {...props}
    />
  );
};
