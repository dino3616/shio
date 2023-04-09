'use client';

import { devtoolsExchange } from '@urql/devtools';
import { createClient as createWsClient } from 'graphql-ws';
import { createClient, cacheExchange, dedupExchange, fetchExchange, subscriptionExchange, Exchange } from 'urql';
import { scalarExchange } from './exchange/scalar.exchange';

const url = process.env['NEXT_PUBLIC_GRAPHQL_ENDPOINT'];
if (!url) {
  throw new Error('NEXT_PUBLIC_GRAPHQL_ENDPOINT is a required.');
}

const exchanges: Exchange[] = [devtoolsExchange, dedupExchange, scalarExchange, cacheExchange, fetchExchange];

if (typeof window !== 'undefined') {
  const wsUrl = process.env['NEXT_PUBLIC_WS_ENDPOINT'];
  if (!wsUrl) {
    throw new Error('NEXT_PUBLIC_WS_ENDPOINT is a required.');
  }

  const wsClient = createWsClient({
    url: wsUrl,
  });

  exchanges.push(
    subscriptionExchange({
      forwardSubscription: (operation) => ({
        subscribe: (sink) => ({
          unsubscribe: wsClient.subscribe(operation, sink),
        }),
      }),
    }),
  );
}

export const urqlClient = createClient({
  url,
  exchanges,
  suspense: true,
});
