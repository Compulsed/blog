import Head from 'next/head'

import gql from 'graphql-tag';
import { getStandaloneApolloClient } from '../libs/get-standalone-apollo-client';

export const getStaticProps = async ({ params }) => {
  const client = await getStandaloneApolloClient();

  await client.query({
    query: gql`
      query {
        hello
        post {
          title
          body
          createdAt
          updatedAt
        }
      }
    `,
    variables: { input: { slug: params?.slug } }
  });

  return {
    props: {
      apolloStaticCache: client.cache.extract()
    }
  };
};


export default function Home(obj) {
  const { hello, post } = obj.apolloStaticCache.ROOT_QUERY;

  return (
    <div className="container">
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1 className="title">
          Welcome to <a href="https://nextjs.org">Dale Salter 2</a>
        </h1>

        <p className="description">
          Value { hello }
        </p>

        <div className="grid">
          {
            post.map(p => (
              <a href="https://nextjs.org/docs" className="card">
                <h3>{p.title}</h3>
                <p>{p.body}</p>
              </a>
            ))
          }

        </div>
      </main>

      <style jsx>{``}</style>

      <style jsx global>{`
        html,
        body {
          padding: 0;
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
            Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue,
            sans-serif;
        }

        * {
          box-sizing: border-box;
        }
      `}</style>
    </div>
  )
}
