import fetch from 'isomorphic-unfetch';

let globalApolloClient;

function initApolloClient(initialState) {
  if (!globalApolloClient) {
    globalApolloClient = new ApolloClient({

      link: new HttpLink({
        uri: "process.env.GRAPHQL_URL",
        fetch
      }),

      cache: new InMemoryCache().restore(initialState || {})
    });
  }
  // client side page transition to an SSG page => update Apollo cache
  else if (initialState) {
    globalApolloClient.cache.restore({
      ...globalApolloClient.cache.extract(),
      ...initialState
    });
  }
  return globalApolloClient;
}

export function withApollo(PageComponent) {
  const WithApollo = ({
    apolloStaticCache,
    ...pageProps
  }) => {
    const client = initApolloClient(apolloStaticCache);

    return (
      <ApolloProvider client={client}>
        <PageComponent {...pageProps} />
      </ApolloProvider>
    );
  };

  if (PageComponent.getInitialProps) {
    WithApollo.getInitialProps = async () => {
      // Run wrapped getInitialProps methods
      let pageProps = {};
      if (PageComponent.getInitialProps) {
        pageProps = await PageComponent.getInitialProps(ctx);
      }
      return pageProps;
    };
  }

  if (process.env.NODE_ENV !== "production") {
    const displayName =
      PageComponent.displayName || PageComponent.name || "Component";

    WithApollo.displayName = `withApollo(${displayName})`;
  }
  return WithApollo;
}

export async function getStandaloneApolloClient() {
    const { ApolloClient, InMemoryCache, HttpLink } = await import(
      "@apollo/client"
    );
    return new ApolloClient({
      link: new HttpLink({
        uri: process.env.GRAPHQL_URL,
        fetch
      }),
      cache: new InMemoryCache()
    });
  }