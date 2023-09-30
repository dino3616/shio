import { getBaseUrl } from '@shio/core/util/get-base-url';
import type { MetadataRoute } from 'next';

const sitemap = (): MetadataRoute.Sitemap => [
  {
    url: getBaseUrl({ app: 'website-v2' }).toString(),
    lastModified: new Date(),
  },
];

export default sitemap;
