import Head from 'next/head';
import type { FC } from 'react';
import { MetaKey } from '@/common/constant/meta-key.constant';

export type MetaProps = {
  title: string;
  hostname: string;
};

export const Meta: FC<MetaProps> = ({ title, hostname }) => (
  <Head>
    <title>{title}</title>
    <link rel="icon" href="/favicon.png" key={MetaKey.ICON} />
    <meta name="viewport" content="initial-scale=1.0, width=device-width" key={MetaKey.VIEWPORT} />
    <meta name="description" content="portfolio site of shio, creator for creators." key={MetaKey.DESCRIPTION} />
    <meta property="og:type" content="website" key={MetaKey.OG_TYPE} />
    <meta property="og:title" content={title} key={MetaKey.OG_TITLE} />
    <meta property="og:description" content="portfolio site of shio, creator for creators." key={MetaKey.OG_DESCRIPTION} />
    <meta property="og:image" content="/ogp.png" key={MetaKey.OG_IMAGE} />
    <meta property="og:image" content={`https://${hostname}/ogp.png`} key={MetaKey.OG_IMAGE} />
    <meta property="twitter:image" content={`https://${hostname}/ogp.png`} key={MetaKey.TWITTER_IMAGE} />
    <meta name="twitter:card" content="summary_large_image" key={MetaKey.TWITTER_CARD} />
    <meta name="twitter:site" content="shio" key={MetaKey.TWITTER_SITE} />
    <meta name="twitter:creator" content="shio" key={MetaKey.TWITTER_CREATOR} />
  </Head>
);
