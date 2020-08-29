import Head from 'next/head';
import Link from 'next/link'
import { gql, useQuery } from '@apollo/client';

import { Container, Row, Col, Card  } from 'react-bootstrap';
import styled from 'styled-components'

import { Header } from '../components/layout/header';

const GET_POSTS = gql`
  query {
    posts {
      postId
      title
      shortDescription
      body
      createdAt
      updatedAt
    }
  }
`;


export default function Home() {
  const { loading, error, data } = useQuery(GET_POSTS);

  return (
    <div>
      <Head>
        <title>Dale Salter</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <Header />

        <Container>
            { (data && data.posts || []).map(p => {
              return (
                <Row key={p.postId}>
                  <Col style={{ padding: 10 }}>
                    <Link href="/post/[id]" as={`/post/${p.postId}`}>
                      <HoverCard>
                        <Card.Body>
                          <Card.Title>{p.title}</Card.Title>
                          <Card.Subtitle className="mb-2 text-muted">{p.shortDescription}</Card.Subtitle>
                          <Card.Text>
                            { p.body }
                          </Card.Text>
                          <Card.Link href="#">Card Link</Card.Link>
                          <Card.Link href="#">Another Link</Card.Link>
                        </Card.Body>
                      </HoverCard>
                    </Link>
                  </Col>
                </Row>
              );
          })}
        </Container>
      </main>
    </div>
  )
}

const HoverCard = styled(Card)`

`