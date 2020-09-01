import { useEffect } from 'react';

import { ThemeProvider } from 'styled-components'
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/styles.css'

import * as gtag from '../libs/gtag'
import Router from 'next/router'

const theme = {
  colors: {
    primary: '#0070f3',
  },
}

import { withApollo } from '../libs/with-apollo';

const App = ({ Component, pageProps }) => {

  useEffect(() => {
    const handleRouteChange = (url) => {
      gtag.pageview(url)
    }
    Router.events.on('routeChangeComplete', handleRouteChange)
    return () => {
      Router.events.off('routeChangeComplete', handleRouteChange)
    }
  }, [])

  return (
    <ThemeProvider theme={theme}>
      <Component {...pageProps} />
    </ThemeProvider>
  );
}

export default withApollo({ ssr: true })(App);