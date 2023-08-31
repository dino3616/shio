import type { ImageData } from '@shio/type';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';

type Feature = {
  label: string;
  description: string;
  icon: (props: ComponentPropsWithoutRef<'svg'>) => ReactNode;
  imageSrc: ImageData;
  imageAlt: string;
};

export type Job = {
  copy: string;
  features: Feature[];
};
