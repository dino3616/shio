import { LinkButton } from '#core/component/link-button';
import { cn } from '@shio/tailwind';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';

type ContactSectionProps = Omit<ComponentPropsWithoutRef<'section'>, 'children' | 'className'>;

export const ContactSection = ({ ...props }: ContactSectionProps): ReactNode => (
  <section className="relative flex h-screen items-center justify-center overflow-hidden px-5 tablet:overflow-visible tablet:px-20" {...props}>
    <div
      aria-hidden
      // HACK: The filter: blur does not work correctly on iPad OS (and possibly iOS), enable GPU acceleration by explicitly specifying transform-gpu.
      className="absolute left-1/2 top-1/2 -z-10 h-[220px] w-[440px] -translate-x-1/2 -translate-y-1/2 transform-gpu rounded-[50%] bg-purple-7 blur-[90px] laptop:h-[428px] laptop:w-[856px] laptop:blur-[220px]"
    />
    <div className="relative flex flex-col gap-10">
      <h1 className="flex w-[90vw] justify-center px-10 drop-shadow-2xl tablet:w-screen">
        <span
          data-copy="Create products that excite the world, together? Contact me here anytime."
          className={cn(
            'relative inline-block max-w-[1200px] py-3 text-4xl font-bold leading-tight text-purple-12 tablet:text-6xl tablet:leading-tight laptop:text-7xl laptop:leading-tight',
            'bg-gradient-to-br from-mauve-12 bg-clip-text text-transparent',
            'before:absolute before:inset-0 before:-z-10 before:h-full before:w-full before:py-3 before:text-dark-mauve-12 before:content-[attr(data-copy)] before:dark:text-light-mauve-12',
          )}
        >
          Create products that excite the world, together? <span className="text-purple-11">Contact me</span> here anytime.
        </span>
      </h1>
      <LinkButton
        href="mailto:me@shio.studio"
        external
        color="purple"
        textSize="2xl"
        border="gradient-pink-purple"
        fontWeight="bold"
        width={{
          initial: 'fit',
          tablet: 'fit',
        }}
        outsideClass="mx-auto"
      >
        Get in Touch
      </LinkButton>
      <div aria-hidden>
        <div
          style={{
            backgroundImage:
              'linear-gradient(to right, hsl(var(--twc-purple-7) / var(--twc-purple-7-opacity, 1)), hsl(var(--twc-purple-7) / var(--twc-purple-7-opacity, 1)) 8px, transparent 2px, transparent 8px)',
            backgroundSize: '18px 2px',
            backgroundPosition: 'center',
            backgroundRepeat: 'repeat-x',
          }}
          className={cn(
            'absolute -top-6 right-0 -z-20 h-1 w-4/5 tablet:right-32 tablet:w-[980px] laptop:right-40',
            'before:absolute before:-top-1/2 before:right-0 before:h-2 before:w-2 before:rounded-full before:bg-purple-7 before:content-[""]',
          )}
        />
        <div
          style={{
            backgroundImage:
              'linear-gradient(to bottom, hsl(var(--twc-purple-7) / var(--twc-purple-7-opacity, 1)), hsl(var(--twc-purple-7) / var(--twc-purple-7-opacity, 1)) 8px, transparent 2px, transparent 8px)',
            backgroundSize: '2px 18px',
            backgroundPosition: 'center',
            backgroundRepeat: 'repeat-y',
          }}
          className={cn(
            'absolute -top-24 right-5 -z-20 h-[calc(84svh)] max-h-[960px] w-1 tablet:-top-32 tablet:right-60 laptop:-top-40 laptop:right-72',
            'before:absolute before:-left-1/2 before:top-0 before:h-2 before:w-2 before:rounded-full before:bg-purple-7 before:content-[""]',
            'after:absolute after:-left-1/2 after:bottom-0 after:h-2 after:w-2 after:rotate-45 after:border-b-2 after:border-r-2 after:border-purple-7 ',
          )}
        />
        <div className="absolute -left-60 top-60 -z-20 h-[360px] w-[360px] rounded-full border-2 border-dashed border-purple-7 tablet:-left-80 tablet:top-52 tablet:h-[418px] tablet:w-[418px] laptop:-left-52 laptop:top-32" />
      </div>
    </div>
  </section>
);
