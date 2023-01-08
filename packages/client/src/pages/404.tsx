import type { NextPage } from 'next';
import { HttpError } from '@/module/http-error/ui/http-error.page';
import { Layout } from '@/module/layout/ui/layout.page';

const Error404: NextPage = () => (
  <Layout title="404 Not Found | shio.dev">
    <HttpError title="404 | Not Found" message="The page you are looking for does not exist." className="flex justify-center p-10" />
  </Layout>
);

export default Error404;
