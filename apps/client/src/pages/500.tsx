import type { NextPage } from 'next';
import { HttpError } from '@/module/http-error/ui/http-error.page';
import { Layout } from '@/module/layout/ui/layout.page';

const Error500: NextPage = () => (
  <Layout title="500 Internal Server Error | shio.dev">
    <HttpError title="500 | Internal Server Error" message="Some error has occurred on the server." className="flex justify-center p-10" />
  </Layout>
);

export default Error500;
