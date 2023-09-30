import { match } from 'ts-pattern';

type GetBaseUrlConfig = {
  app: 'api' | 'website-v1' | 'website-v2';
  forceCustomDomain?: boolean;
};

type GetApiBaseUrlConfig = Omit<GetBaseUrlConfig, 'app'>;

const getApiBaseUrl = ({ forceCustomDomain }: GetApiBaseUrlConfig): URL => {
  let baseUrl: URL;
  if (process.env['NODE_ENV'] === 'production' || forceCustomDomain) {
    baseUrl = new URL('https://api.shio.studio/');
  } else {
    baseUrl = new URL(`http://localhost:${process.env['PORT'] || 4000}`);
  }

  return baseUrl;
};

type GetWebsiteBaseUrlConfig = Omit<GetBaseUrlConfig, 'app'> & {
  asLatestVersion?: boolean;
};

const getWebsiteV1BaseUrl = ({ forceCustomDomain, asLatestVersion = false }: GetWebsiteBaseUrlConfig): URL => {
  let baseUrl: URL;
  if (process.env['VERCEL_URL'] && !forceCustomDomain) {
    baseUrl = new URL(`https://${process.env['VERCEL_URL']}`);
  } else if (forceCustomDomain && !asLatestVersion) {
    baseUrl = new URL('https://v1.shio.studio/');
  } else if (forceCustomDomain && asLatestVersion) {
    baseUrl = new URL('https://shio.studio/');
  } else {
    baseUrl = new URL(`http://localhost:${process.env['PORT'] || 3000}`);
  }

  return baseUrl;
};

const getWebsiteV2BaseUrl = ({ forceCustomDomain, asLatestVersion = false }: GetWebsiteBaseUrlConfig): URL => {
  let baseUrl: URL;
  if (process.env['VERCEL_URL'] && !forceCustomDomain) {
    baseUrl = new URL(`https://${process.env['VERCEL_URL']}`);
  } else if (forceCustomDomain && !asLatestVersion) {
    baseUrl = new URL('https://v2.shio.studio/');
  } else if (forceCustomDomain && asLatestVersion) {
    baseUrl = new URL('https://shio.studio/');
  } else {
    baseUrl = new URL(`http://localhost:${process.env['PORT'] || 3000}`);
  }

  return baseUrl;
};

export const getBaseUrl = ({ app, forceCustomDomain = false }: GetBaseUrlConfig): URL => {
  const baseUrl = match<typeof app, URL>(app)
    .with('api', () => getApiBaseUrl({ forceCustomDomain }))
    .with('website-v1', () => getWebsiteV1BaseUrl({ forceCustomDomain }))
    .with('website-v2', () => getWebsiteV2BaseUrl({ forceCustomDomain, asLatestVersion: true }))
    .exhaustive();

  return baseUrl;
};
