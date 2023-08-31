import { type VariantProps, cn, tv } from '@shio/tailwind';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { Link } from '#core/component/link';

const linkButtonVariant = tv({
  variants: {
    color: {
      mauve: 'bg-mauve-3 text-mauve-11 hover:bg-mauve-4',
      purple: 'bg-purple-3 text-purple-11 hover:bg-purple-4',
    },
    textSize: {
      xl: 'text-base tablet:text-xl',
      '2xl': 'text-lg tablet:text-2xl',
    },
    textColor: {
      mauve: 'text-mauve-12',
      'accent-mauve': 'text-mauve-11',
      purple: 'text-purple-12',
      'accent-purple': 'text-purple-11',
    },
    border: {
      purple: cn('relative m-0.5', "after:absolute after:-inset-0.5 after:z-[-1] after:rounded-lg after:bg-purple-7 after:content-['']"),
      'gradient-pink-purple': cn(
        'relative m-0.5',
        "after:absolute after:-inset-0.5 after:z-[-1] after:rounded-lg after:bg-gradient-to-br after:from-pink-7 after:to-purple-7 after:content-['']",
      ),
    },
    fontWeight: {
      normal: 'font-normal',
      bold: 'font-bold',
    },
    width: {
      fit: 'w-fit',
    },
  },
});

type LinkButtonProps = ComponentPropsWithoutRef<typeof Link> &
  VariantProps<typeof linkButtonVariant> & {
    outsideClass?: ComponentPropsWithoutRef<typeof Link>['className'];
  };

export const LinkButton = ({
  color = 'mauve',
  textSize = 'xl',
  textColor = undefined,
  border = undefined,
  fontWeight = 'normal',
  width = undefined,
  outsideClass,
  children,
  ...props
}: LinkButtonProps): ReactNode => (
  <Link
    role="button"
    tabIndex={0}
    className={cn(
      'inline-block w-full self-stretch rounded-lg px-8 py-3 text-center transition tablet:w-auto',
      linkButtonVariant({ color, textSize, textColor, border, fontWeight, width }),
      outsideClass,
    )}
    {...props}
  >
    {children}
  </Link>
);
