import { cacheExchange, createClient, fetchExchange, ssrExchange } from '@urql/core';
import { devtoolsExchange } from '@urql/devtools';
import { registerUrql } from '@urql/next/rsc';
import { createScalarExchamge } from './exchange/scalar-exchange';
import { createSubscriptionExchange } from './exchange/subscription-exchange';

export const createUrqlClient = (scheme: Parameters<typeof createScalarExchamge>[0], graphqlUrl: string, wsUrl: string) => {
  const ssr = ssrExchange();

  const urqlClient = createClient({
    url: graphqlUrl,
    exchanges: [devtoolsExchange, createScalarExchamge(scheme), cacheExchange, ssr, fetchExchange, createSubscriptionExchange(wsUrl)],
    suspense: true,
  });

  return { urqlClient, ssr };
};

export const createUrqlRegister = (
  scheme: Parameters<typeof createUrqlClient>[0],
  graphqlUrl: Parameters<typeof createUrqlClient>[1],
  wsUrl: Parameters<typeof createUrqlClient>[2],
) => registerUrql(() => createUrqlClient(scheme, graphqlUrl, wsUrl).urqlClient);
