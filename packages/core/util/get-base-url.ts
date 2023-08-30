type Config = {
  forceCustomDomain?: boolean;
};

const defaultConfig: Config = {
  forceCustomDomain: false,
};

export const getBaseUrl = ({ forceCustomDomain }: Config = defaultConfig): URL => {
  let baseUrl: URL;
  if (process.env['VERCEL_URL'] && !forceCustomDomain) {
    baseUrl = new URL(`https://${process.env['VERCEL_URL']}`);
  } else if (forceCustomDomain) {
    baseUrl = new URL('https://shio.studio/');
  } else {
    baseUrl = new URL(`http://localhost:${process.env['PORT'] || 3000}`);
  }

  if (!baseUrl.pathname.endsWith('/')) {
    baseUrl.pathname = `${baseUrl.pathname}/`;
  }

  return baseUrl;
};
