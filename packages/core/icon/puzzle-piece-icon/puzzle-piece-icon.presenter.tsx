import type { ComponentPropsWithoutRef, ReactNode } from 'react';

type PuzzlePieceIconProps = Omit<ComponentPropsWithoutRef<'svg'>, 'children'>;

export const PuzzlePieceIcon = ({ ...props }: PuzzlePieceIconProps): ReactNode => (
  <svg width="72" height="72" viewBox="0 0 72 72" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M46.6256 63.5H58.5C59.6935 63.5 60.8381 63.0259 61.682 62.182C62.5259 61.3381 63 60.1935 63 59V48.4109C62.9981 48.042 62.9054 47.6791 62.7303 47.3544C62.5551 47.0296 62.3027 46.7529 61.9954 46.5487C61.6881 46.3445 61.3352 46.219 60.968 46.1832C60.6007 46.1475 60.2303 46.2026 59.8894 46.3438C59.092 46.6731 58.2377 46.8422 57.375 46.8416C53.6541 46.8416 50.625 43.7197 50.625 39.8862C50.625 36.0528 53.6541 32.9309 57.375 32.9309C58.2377 32.9303 59.092 33.0994 59.8894 33.4288C60.2321 33.5706 60.6045 33.6256 60.9736 33.5887C61.3426 33.5519 61.6968 33.4244 62.0047 33.2175C62.3126 33.0107 62.5646 32.731 62.7382 32.4033C62.9118 32.0755 63.0018 31.71 63 31.3391V20.75C63 19.5565 62.5259 18.4119 61.682 17.568C60.8381 16.7241 59.6935 16.25 58.5 16.25H48.3131C48.355 15.8765 48.3757 15.5009 48.375 15.125C48.375 12.4397 47.3083 9.86435 45.4095 7.96554C43.5107 6.06674 40.9353 5 38.25 5C35.5647 5 32.9894 6.06674 31.0905 7.96554C29.1917 9.86435 28.125 12.4397 28.125 15.125C28.1243 15.5009 28.145 15.8765 28.1869 16.25H18C16.8065 16.25 15.6619 16.7241 14.818 17.568C13.9741 18.4119 13.5 19.5565 13.5 20.75V29.8119C13.1265 29.77 12.7509 29.7493 12.375 29.75C9.68968 29.75 7.11435 30.8167 5.21554 32.7155C3.31674 34.6144 2.25 37.1897 2.25 39.875C2.25 42.5603 3.31674 45.1357 5.21554 47.0345C7.11435 48.9333 9.68968 50 12.375 50C12.7509 50.0007 13.1265 49.98 13.5 49.9381V59C13.5 60.1935 13.9741 61.3381 14.818 62.182C15.6619 63.0259 16.8065 63.5 18 63.5H29.8744" />
  </svg>
);
