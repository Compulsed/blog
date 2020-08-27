import Head from 'next/head'

import gql from 'graphql-tag';
import { getStandaloneApolloClient } from '../libs/get-standalone-apollo-client';

import {
  Container,
  Row,
  Col,
  Card 
} from 'react-bootstrap';


export const getStaticProps = async ({ params }) => {
  const client = await getStandaloneApolloClient();

  await client.query({
    query: gql`
      query {
        hello
        posts {
          title
          shortDescription
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


export default function Home(query) {
  const { posts } = query.apolloStaticCache.ROOT_QUERY;

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

        <Container>
            { posts.map(p => (
              <Row>
                <Col style={{ padding: 10 }}>
                  <a href="/" style={{ textDecoration: 'none' }}>
                    <Card>
                      <Card.Body>
                        <Card.Title>Card Title</Card.Title>
                        <Card.Subtitle className="mb-2 text-muted">Card Subtitle</Card.Subtitle>
                        <Card.Text>
                          Some quick example text to build on the card title and make up the bulk of
                          the card's content.
                        </Card.Text>
                        <Card.Link href="#">Card Link</Card.Link>
                        <Card.Link href="#">Another Link</Card.Link>
                      </Card.Body>
                    </Card>
                  </a>
                </Col>
              </Row>
            ))
            }
        </Container>
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
