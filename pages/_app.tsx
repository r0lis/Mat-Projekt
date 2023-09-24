import '../styles/globals.css';

import { ApolloProvider } from '@apollo/client';
import type { AppProps } from 'next/app';
import React from 'react';

import { AuthContextProvider } from '@/components/AuthContextProvider';
import { getApolloClient } from '@/utility/apollo-client';

const client = getApolloClient({ forceNew: false });

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthContextProvider>
      <ApolloProvider client={client}>
        <Component {...pageProps} />
      </ApolloProvider>
    </AuthContextProvider>
  );
}
