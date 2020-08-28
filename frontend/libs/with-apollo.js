import { ApolloProvider } from '@apollo/client';
import App from 'next/app';
import Head from 'next/head';
import { initOnContext } from './init-on-context';
import { initApolloClient } from './init-apollo-client';

const withApollo = ({ ssr = false } = {}) => PageComponent => {
  const WithApollo = ({ apolloClient, apolloState, ...pageProps }) => {
    const client = apolloClient ? apolloClient : initApolloClient(apolloState);

    return (
      <ApolloProvider client={client}>
        <PageComponent {...pageProps} />
      </ApolloProvider>
    );
  };

  // Set the correct displayName in development
  if (process.env.NODE_ENV !== 'production') {
    const displayName = PageComponent.displayName || PageComponent.name || 'Component';
    WithApollo.displayName = `withApollo(${displayName})`;
  }

  if (ssr || PageComponent.getInitialProps) {
    WithApollo.getInitialProps = async ctx => {
      const inAppContext = Boolean(ctx.ctx);

      const { apolloClient } = initOnContext(ctx);

      let pageProps = {};
      if (PageComponent.getInitialProps) {
        pageProps = await PageComponent.getInitialProps(ctx);
      } else if (inAppContext) {
        pageProps = await App.getInitialProps(ctx);
      }

      if (typeof window === 'undefined') {
        const { AppTree } = ctx;

        if (ctx.res && ctx.res.finished) {
          return pageProps;
        }

        if (ssr && AppTree) {
          try {
            const { getDataFromTree } = await import('@apollo/client/react/ssr');

            let props;

            if (inAppContext) {
              props = { ...pageProps, apolloClient };
            } else {
              props = { pageProps: { ...pageProps, apolloClient } };
            }

            await getDataFromTree(<AppTree {...props} />);
          } catch (error) {
            console.error('Error while running `getDataFromTree`', error);
          }

          Head.rewind();
        }
      }

      return {
        ...pageProps,
        apolloState: apolloClient.cache.extract(),
        apolloClient: ctx.apolloClient
      };
    };
  }

  return WithApollo;
};

export { withApollo };