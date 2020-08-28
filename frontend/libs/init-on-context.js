import { initApolloClient } from './init-apollo-client';

const initOnContext = ctx => {
  const inAppContext = Boolean(ctx.ctx);

  if (process.env.NODE_ENV === 'development') {
    if (inAppContext) {
      console.warn(
        'Warning: You have opted-out of Automatic Static Optimization due to `withApollo` in `pages/_app`.\n' +
          'Read more: https://err.sh/next.js/opt-out-auto-static-optimization\n'
      );
    }
  }

  const apolloClient = ctx.apolloClient || initApolloClient(ctx.apolloState || {}, inAppContext ? ctx.ctx : ctx);

  apolloClient.toJSON = () => null;

  ctx.apolloClient = apolloClient;

  if (inAppContext) {
    ctx.ctx.apolloClient = apolloClient;
  }

  return ctx;
};

export { initOnContext };