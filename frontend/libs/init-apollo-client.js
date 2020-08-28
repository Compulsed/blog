import { createApolloClient } from './create-apollo-client';

let globalApolloClient = null;

const initApolloClient = (initialState, ctx) => {
  // Make sure to create a new client for every server-side request so that data
  // isn't shared between connections
  if (typeof window === 'undefined') {
    return createApolloClient(initialState, ctx);
  }

  // Reuse client on the client-side
  if (!globalApolloClient) {
    globalApolloClient = createApolloClient(initialState, ctx);
  }

  return globalApolloClient;
};

export { initApolloClient };