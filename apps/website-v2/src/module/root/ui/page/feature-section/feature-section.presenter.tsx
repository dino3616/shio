'use client';

import { useState, type ComponentPropsWithoutRef, type ReactNode } from 'react';
import { FeatureSelect } from '@/module/root/ui/component/feature-select';

type Feature = 'frontend-engineer' | 'designer';

type FeatureSectionProps = Omit<ComponentPropsWithoutRef<'section'>, 'children' | 'className'>;

export const FeatureSection = ({ ...props }: FeatureSectionProps): ReactNode => {
  const [feature, setFeature] = useState<Feature>('frontend-engineer');

  return (
    <section className="flex flex-col items-center gap-12 p-12 tablet:gap-28 tablet:px-20 laptop:px-28" {...props}>
      <h1 className="flex flex-col items-center gap-8 text-4xl font-bold text-mauve-12 tablet:text-6xl laptop:text-7xl desktop:flex-row">
        I&apos;m a ...,&nbsp;
        <FeatureSelect selectedFeature={feature} onFeatureChange={setFeature} features={['frontend-engineer', 'designer']} />
      </h1>
    </section>
  );
};
