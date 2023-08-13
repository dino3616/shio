'use client';

import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger } from '@shio/core/component/select';
import { ArrowHeadIcon } from '@shio/core/icon/arrow-head-icon';
import { type ComponentPropsWithoutRef, useEffect, useState } from 'react';

const toTitleCase = (str: string) =>
  str
    .split('-')
    .map((word) => word[0]?.toUpperCase() + word.slice(1))
    .join(' ');

const toKebabCase = (str: string) => str.toLowerCase().replace(/\s/g, '-');

type FeatureSelectProps<Feature extends string> = Omit<
  ComponentPropsWithoutRef<typeof Select>,
  'children' | 'className' | 'onValueChange' | 'value'
> & {
  selectedFeature: Feature;
  onFeatureChange: (feature: Feature) => void;
  features: Feature[];
};

export const FeatureSelect = <Feature extends string>({ selectedFeature, onFeatureChange, features, ...props }: FeatureSelectProps<Feature>) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <Select
      value={mounted ? toTitleCase(selectedFeature) : undefined}
      onValueChange={(featureValue) => {
        const feature = toKebabCase(featureValue) as Feature;
        if (!features.includes(feature)) {
          throw new Error(`Invalid feature: ${feature}`);
        }

        onFeatureChange(feature);
      }}
      {...props}
    >
      <SelectTrigger
        aria-label="feature selector"
        aria-description={`Selector to choose between ${features.join(', ')}.`}
        display="inline-flex"
        color="purple"
        textSize={{
          initial: '3xl',
          tablet: '6xl',
          laptop: '7xl',
        }}
        rounded="2xl"
        icon={ArrowHeadIcon}
      >
        {toTitleCase(selectedFeature)}
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {features.map((feature) => (
            <SelectItem key={feature} value={toTitleCase(feature)}>
              <span className="flex items-center gap-3">{feature}</span>
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};
