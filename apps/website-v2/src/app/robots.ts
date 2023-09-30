import { getBaseUrl } from '@shio/core/util/get-base-url';
import type { MetadataRoute } from 'next';

const robots = (): MetadataRoute.Robots => ({
  rules: {
    userAgent: '*',
    allow: '/',
    disallow: ['/api', '/_next'],
  },
  sitemap: `${getBaseUrl({ app: 'website-v2' }).toString()}sitemap.xml`,
});

export default robots;
