import { match } from 'ts-pattern';

type GetBaseUrlConfig = {
  app: 'api' | 'website-v1' | 'website-v2';
};

const getApiBaseUrl = (): URL => {
  let baseUrl: URL;
  if (process.env['NODE_ENV'] === 'production') {
    baseUrl = new URL('https://api.shio.studio/');
  } else {
    baseUrl = new URL(`http://localhost:${process.env['PORT'] || 4000}`);
  }

  return baseUrl;
};

type GetWebsiteBaseUrlConfig = {
  asLatestVersion?: boolean;
};

const getWebsiteV1BaseUrl = ({ asLatestVersion = false }: GetWebsiteBaseUrlConfig = {}): URL => {
  let baseUrl: URL;
  if (asLatestVersion) {
    baseUrl = new URL('https://shio.studio/');
  } else if (!asLatestVersion) {
    baseUrl = new URL('https://v1.shio.studio/');
  } else if (process.env['VERCEL_URL']) {
    baseUrl = new URL(`https://${process.env['VERCEL_URL']}`);
  } else {
    baseUrl = new URL(`http://localhost:${process.env['PORT'] || 3000}`);
  }

  return baseUrl;
};

const getWebsiteV2BaseUrl = ({ asLatestVersion = false }: GetWebsiteBaseUrlConfig = {}): URL => {
  let baseUrl: URL;
  if (asLatestVersion) {
    baseUrl = new URL('https://shio.studio/');
  } else if (!asLatestVersion) {
    baseUrl = new URL('https://v2.shio.studio/');
  } else if (process.env['VERCEL_URL']) {
    baseUrl = new URL(`https://${process.env['VERCEL_URL']}`);
  } else {
    baseUrl = new URL(`http://localhost:${process.env['PORT'] || 3000}`);
  }

  return baseUrl;
};

export const getBaseUrl = ({ app }: GetBaseUrlConfig): URL => {
  const baseUrl = match<typeof app, URL>(app)
    .with('api', () => getApiBaseUrl())
    .with('website-v1', () => getWebsiteV1BaseUrl())
    .with('website-v2', () => getWebsiteV2BaseUrl({ asLatestVersion: true }))
    .exhaustive();

  if (!baseUrl.pathname.endsWith('/')) {
    baseUrl.pathname = `${baseUrl.pathname}/`;
  }

  return baseUrl;
};
