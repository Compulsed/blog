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
      longDescription
      imageUrl
      body
      createdAt
      updatedAt
    }
  }
`;


export default function Home() {
  // const { loading, error, data } = useQuery(GET_POSTS);

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
                    <Link href="/post/[id]" as={`/post/${post.postId}`} passHref>
                      <ArticleLink>
                        <ArticleCard>
                          <Row>
                            <Col sm={10}>
                              <h3>{post.title}</h3>
                              <h5 className="mb-2 text-muted">{post.shortDescription}</h5>
                              <p>{ post.longDescription }</p>
                            </Col>
                            <Col sm={2}>
                              <ArticleImage src={post.imageUrl} />
                            </Col>
                          </Row>
                        </ArticleCard>
                      </ArticleLink>
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

const ArticleImage = styled.img`
  width: 100%;
`

const ArticleLink = styled.a`
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

const ArticleCard = styled.div`
  border: 1px solid transparent;
  padding 20px;
  border-radius: 5px;
  box-shadow: 0px 3px 15px rgba(0,0,0,0.01);

  :hover {
    border: 1px solid #d0d0d0;
    cursor: pointer;
  }
`