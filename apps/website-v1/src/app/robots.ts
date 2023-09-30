import { getBaseUrl } from '@shio/core/util/get-base-url';
import type { MetadataRoute } from 'next';

const robots = (): MetadataRoute.Robots => ({
  rules: {
    userAgent: '*',
    disallow: '*',
  },
  sitemap: `${getBaseUrl({ app: 'website-v1', forceCustomDomain: true }).toString()}sitemap.xml`,
});

export default robots;
