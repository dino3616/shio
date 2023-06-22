export const getBaseUrl = (): URL => {
  const baseUrl = new URL(process.env['VERCEL_URL'] ? `https://${process.env['VERCEL_URL']}` : `http://localhost:${process.env['PORT'] || 3000}`);

  return baseUrl;
};
