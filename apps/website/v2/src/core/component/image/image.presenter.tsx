import NextImage from 'next/image';
import { ComponentPropsWithRef, ElementRef, forwardRef } from 'react';

type ImageProps = ComponentPropsWithRef<typeof NextImage>;

export const Image = forwardRef<ElementRef<typeof NextImage>, Omit<ImageProps, 'ref'>>((props, ref) => <NextImage ref={ref} {...props} />);

Image.displayName = 'Image';
