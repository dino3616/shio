import type { MetadataRoute } from 'next';
import { getBaseUrl } from '@/core/util/get-base-url';

const sitemap = (): MetadataRoute.Sitemap => [
  {
    url: getBaseUrl().toString(),
    lastModified: new Date(),
  },
];

export default sitemap;
