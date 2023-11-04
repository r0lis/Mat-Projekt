import '../styles/globals.css';

import { ApolloProvider } from '@apollo/client';
import type { AppProps } from 'next/app';
import React from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { AuthContextProvider } from '@/components/AuthContextProvider';
import { getApolloClient } from '@/utility/apollo-client';
import '../styles/indexPage/AppContentStyle.css'
import '../styles/indexPage/Footer.css'
import '../styles/indexPage/FooterImg.css'

const client = getApolloClient({ forceNew: false });

export default function App({ Component, pageProps }: AppProps) {

  const theme = createTheme({
    typography: {
      fontFamily: 'Alumni Sans Collegiate One, sans-serif',
    },
  });
  return (
    <AuthContextProvider>
      <ApolloProvider client={client}>
        <ThemeProvider theme={theme}>
        <Component {...pageProps} />
        </ThemeProvider>
      </ApolloProvider>
    </AuthContextProvider>
  );
}
