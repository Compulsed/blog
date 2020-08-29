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
            { (data && data.posts || []).map(post => {
              return (
                <Row key={post.postId}>
                  <Col style={{ padding: 10 }}>
                    <Link href="/post/[id]" as={`/post/${post.postId}`} >
                      <HoverLink>
                        <HoverCard>
                          <Card.Body>
                            <Card.Title>{post.title}</Card.Title>
                            <Card.Subtitle className="mb-2 text-muted">{post.shortDescription}</Card.Subtitle>
                            <Card.Text>
                              { post.body }
                            </Card.Text>
                          </Card.Body>
                        </HoverCard>
                      </HoverLink>
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

const HoverLink = styled.a`
  text-decoration: none;
  color: inherit;
  outline: 0;
  cursor: auto;

  :hover {
    text-decoration: none;
    color: inherit;
    outline: 0;
    cursor: auto;
  }
`

const HoverCard = styled(Card)`
  border: 1px solid transparent;

  :hover {
    border: 1px solid #d0d0d0;
    cursor: pointer;
  }
`