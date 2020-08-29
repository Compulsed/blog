import { ApolloClient, ApolloLink, InMemoryCache } from '@apollo/client';
import { HttpLink } from '@apollo/client';
import fetch from 'isomorphic-unfetch'

const httpLink = new HttpLink({
  credentials: 'same-origin',
  uri: 'https://2vx6g5nj7c.execute-api.us-east-1.amazonaws.com/production/graphql',
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