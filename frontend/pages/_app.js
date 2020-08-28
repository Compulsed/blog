import 'bootstrap/dist/css/bootstrap.min.css';
import { withApollo } from '../libs/with-apollo';

function MyApp({ Component, pageProps }) {
    return (
        <Component {...pageProps} />
    )
}

export default withApollo({ ssr: true })(MyApp);
