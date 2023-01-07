import Head from 'next/head';
import type { FC } from 'react';
import { MetaKey } from '@/common/constant/meta-key.constant';

export type MetaProps = {
  title: string;
};

export const Meta: FC<MetaProps> = ({ title }) => (
  <Head>
    <title>{title}</title>
    <link rel="icon" href="/favicon.png" key={MetaKey.FAVICON} />
    <meta name="viewport" content="initial-scale=1.0, width=device-width" key={MetaKey.VIEWPORT} />
  </Head>
);
