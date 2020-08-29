import { ApolloClient, ApolloLink, InMemoryCache } from '@apollo/client';
import { HttpLink } from '@apollo/client';
import fetch from 'isomorphic-unfetch'

const httpLink = new HttpLink({
  credentials: 'same-origin',
  uri: process.env.GRAPHQL_URL,
  fetch
});

export { httpLink };

const createApolloClient = (initialState, ctx) => {
  return new ApolloClient({
    connectToDevTools: typeof window !== 'undefined' && process.env.NODE_ENV !== 'production',
    ssrMode: Boolean(ctx),
    link: ApolloLink.from([httpLink]), // TODO: Error link
    cache: new InMemoryCache().restore(initialState)
  });
};

export { createApolloClient };