import App from 'next/app'

import { ThemeProvider } from 'styled-components'
import 'bootstrap/dist/css/bootstrap.min.css';

const theme = {
  colors: {
    primary: '#0070f3',
  },
}

import { withApollo } from '../libs/with-apollo';

class MyApp extends App {
  render() {
    const { Component, pageProps } = this.props
    return (
      <ThemeProvider theme={theme}>
        <Component {...pageProps} />
      </ThemeProvider>
    )
  }
}

export default withApollo({ ssr: true })(MyApp);