import { type VariantProps, cn, tv } from '@shio/tailwind';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { Link } from '#core/component/link';

const linkButtonVariant = tv({
  variants: {
    color: {
      mauve: 'bg-mauve-3 text-mauve-11 hover:bg-mauve-4',
      purple: 'bg-purple-3 text-purple-11 hover:bg-purple-4',
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
  },
});

type LinkButtonProps = ComponentPropsWithoutRef<typeof Link> & VariantProps<typeof linkButtonVariant>;

export const LinkButton = ({
  color = 'mauve',
  textColor = undefined,
  border = undefined,
  fontWeight = 'normal',
  children,
  ...props
}: LinkButtonProps): ReactNode => (
  <Link
    role="button"
    tabIndex={0}
    className={cn(
      'inline-block w-full self-stretch rounded-lg px-8 py-3 text-center transition tablet:w-auto tablet:text-xl',
      linkButtonVariant({ color, textColor, border, fontWeight }),
    )}
    {...props}
  >
    {children}
  </Link>
);
