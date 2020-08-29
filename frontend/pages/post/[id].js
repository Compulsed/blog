import Head from 'next/head';

import { gql, useQuery } from '@apollo/client';
import { withRouter } from 'next/router'

import { Container, Row, Col, Card } from 'react-bootstrap';
import { Header } from '../../components/layout/header';

const GET_POSTS = gql`
  query($postId: String!) {
    post(postId: $postId) {
      postId
      title
      shortDescription
      body
      createdAt
      updatedAt
    }
  }
`;

function Post({ router }) {
  const { loading, error, data } = useQuery(
    GET_POSTS,
    { variables: { postId: router.query.id } }
  );

  if (loading || !data) {
    return <div></div>;
  }

  const post = data.post;

  return (
    <div>
      <Head>
        <title>Dale Salter</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <Header />

        <Container>
            <Row>
                <Col style={{ padding: 10 }}>
                    <Card>
                        <Card.Body>
                          <Card.Title>{ post.title }</Card.Title>
                          <Card.Subtitle className="mb-2 text-muted">{ post.shortDescription }</Card.Subtitle>
                          <Card.Text>
                              { post.body }
                          </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>

      </main>
    </div>
  )
}

export default withRouter(Post);