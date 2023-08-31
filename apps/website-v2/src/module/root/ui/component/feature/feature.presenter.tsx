import { Image } from '@shio/core/component/image';
import { breakpoints } from '@shio/design-token';
import { type VariantProps, cn, tv } from '@shio/tailwind';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import type { Job } from '@/module/root/model/job';

// eslint-disable-next-line tailwindcss/no-custom-classname
const featureVariant = tv({
  slots: {
    base: '',
    imageContainer: '',
    blurredImage: '',
  },
  variants: {
    reverse: {
      true: '',
    },
  },
  compoundSlots: [
    {
      slots: ['base'],
      reverse: true,
      className: 'laptop:flex-row-reverse',
    },
    {
      slots: ['imageContainer'],
      reverse: true,
      className: 'laptop:-translate-x-4 laptop:-translate-y-4',
    },
    {
      slots: ['imageContainer'],
      reverse: false,
      className: 'laptop:translate-x-4 laptop:translate-y-4',
    },
    {
      slots: ['blurredImage'],
      reverse: true,
      className: 'laptop:left-8 laptop:top-8',
    },
    {
      slots: ['blurredImage'],
      reverse: false,
      className: 'laptop:-left-8 laptop:-top-8',
    },
  ],
});

type FeatureProps = Omit<ComponentPropsWithoutRef<'div'>, 'children' | 'className'> &
  VariantProps<typeof featureVariant> & {
    featureLabel: Job['features'][number]['label'];
    featureDescription: Job['features'][number]['description'];
    icon: Job['features'][number]['icon'];
    imageSrc: Job['features'][number]['imageSrc'];
    imageAlt: Job['features'][number]['imageAlt'];
  };

export const Feature = ({ featureLabel, featureDescription, icon: Icon, imageSrc, imageAlt, reverse = false, ...props }: FeatureProps): ReactNode => {
  const { base, imageContainer, blurredImage } = featureVariant({ reverse });

  return (
    <div className={cn('flex flex-col-reverse gap-8 laptop:flex-row laptop:gap-16', base())} {...props}>
      <div className="flex max-w-xl flex-col gap-4 laptop:mt-8">
        <h2 className="flex items-center gap-3">
          <Icon className="h-7 w-7 tablet:h-8 tablet:w-8" />
          <span className="text-3xl font-bold text-mauve-12 tablet:text-4xl">{featureLabel}</span>
        </h2>
        <p className="text-base text-mauve-11 tablet:text-lg">{featureDescription}</p>
      </div>
      <figure className={cn('relative shrink-0', imageContainer())}>
        <Image
          aria-hidden
          src={imageSrc}
          sizes={`${breakpoints.laptop.mediaQuery} 384px, 100vw`}
          alt=""
          className={cn(
            'absolute inset-0 -z-10 h-40 w-full rounded-lg object-cover blur tablet:h-80 tablet:rounded-3xl laptop:w-96 laptop:blur-sm',
            blurredImage(),
          )}
        />
        <Image
          src={imageSrc}
          sizes={`${breakpoints.laptop.mediaQuery} 384px, 100vw`}
          alt={imageAlt}
          className="h-40 w-full rounded-lg object-cover tablet:h-80 tablet:rounded-3xl laptop:w-96"
        />
      </figure>
    </div>
  );
};
