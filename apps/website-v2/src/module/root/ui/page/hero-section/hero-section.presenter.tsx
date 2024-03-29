import { Button } from '@shio/core/component/button';
import { LinkButton } from '@shio/core/component/link-button';
import { cn } from '@shio/tailwind';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';

type HeroSectionProps = Omit<ComponentPropsWithoutRef<'section'>, 'children' | 'className'> & {
  onAboutMeButtonClick?: ComponentPropsWithoutRef<typeof Button>['onClick'];
};

export const HeroSection = ({ onAboutMeButtonClick, ...props }: HeroSectionProps): ReactNode => (
  <section className="relative flex h-screen items-center justify-center overflow-hidden px-5 tablet:overflow-visible tablet:px-20" {...props}>
    <div
      aria-hidden
      // HACK: The filter: blur does not work correctly on iPad OS (and possibly iOS), enable GPU acceleration by explicitly specifying transform-gpu.
      className="absolute left-1/2 top-1/2 -z-10 h-[220px] w-[440px] -translate-x-1/2 -translate-y-1/2 transform-gpu rounded-[50%] bg-purple-7 blur-[90px] laptop:h-[428px] laptop:w-[856px] laptop:blur-[220px]"
    />
    <div className="relative flex flex-col gap-10">
      <hgroup className="mr-5 flex max-w-6xl flex-col gap-5 tablet:mr-60 laptop:mr-72">
        <h1 className="text-4xl font-bold text-purple-12 drop-shadow-2xl tablet:text-6xl laptop:text-7xl">
          Provide <span className="text-purple-11">accessible</span> Web for everyone, everywhere.
        </h1>
        <p className="text-purple-12 tablet:text-xl">
          Equal web experience for all. My goal is to ensure that <i>any person</i>, regardless of geographic, economic, or physical limitations, can
          access the web and participate freely in information and resources.
        </p>
      </hgroup>
      <div className="flex flex-col items-center gap-6 tablet:flex-row">
        <Button color="purple" border="purple" onClick={onAboutMeButtonClick}>
          About Me
        </Button>
        <LinkButton href="mailto:me@shio.studio" external color="purple" textColor="purple" border="gradient-pink-purple" fontWeight="bold">
          Get in Touch
        </LinkButton>
      </div>
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
            'absolute -top-6 right-0 -z-10 h-1 w-4/5 tablet:right-32 tablet:w-[980px] laptop:right-40',
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
            'absolute -top-24 right-5 -z-10 h-[calc(84svh)] max-h-[960px] w-1 tablet:-top-32 tablet:right-60 laptop:-top-40 laptop:right-72',
            'before:absolute before:-left-1/2 before:top-0 before:h-2 before:w-2 before:rounded-full before:bg-purple-7 before:content-[""]',
            'after:absolute after:-left-1/2 after:bottom-0 after:h-2 after:w-2 after:rotate-45 after:border-b-2 after:border-r-2 after:border-purple-7 ',
          )}
        />
        <div className="absolute -left-60 top-60 -z-10 h-[360px] w-[360px] rounded-full border-2 border-dashed border-purple-7 tablet:-left-80 tablet:top-52 tablet:h-[418px] tablet:w-[418px] laptop:-left-52 laptop:top-32" />
      </div>
    </div>
  </section>
);
