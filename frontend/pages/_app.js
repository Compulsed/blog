import { ThemeProvider } from 'styled-components'
import 'bootstrap/dist/css/bootstrap.min.css';

import { withApollo } from '../libs/with-apollo';

const theme = {
    colors: {
      primary: '#0070f3',
    },
}

function MyApp({ Component, pageProps }) {
    return (
        <ThemeProvider theme={theme}>
            <Component {...pageProps} />
        </ThemeProvider>
    )
}

export default withApollo({ ssr: true })(MyApp);