import Head from 'next/head';
import Link from 'next/link'

import { gql, useQuery } from '@apollo/client';
import { withRouter } from 'next/router'

import { Container, Row, Col, Card } from 'react-bootstrap';
import { Header } from '../../components/layout/header';
import ReactMarkdown from 'react-markdown';
import styled from 'styled-components'

const GET_POSTS = gql`
  query($postId: String!) {
    post(postId: $postId) {
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
        </Container>

        <Container>
            <Row>
                <Col style={{ padding: 10 }}>
                  <StyledReactMarkdown source={post.body} />
                </Col>
            </Row>
        </Container>

      </main>
    </div>
  )
}

const StyledReactMarkdown = styled(ReactMarkdown)`
  padding 20px;
  box-shadow: 0px 3px 15px rgba(0,0,0,0.01);

  h1 {
    font-size: 24px;
  }

  h2 {
    font-size: 20px;
  }

  h3 {
    font-size: 16px;
  }

  h4 {
    font-size: 14px;
  }

  h5 {
    font-size: 12px;
  }

  img {
    display: block;
    margin-left: auto;
    margin-right: auto;
    width: 25%;
  }
`

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
  padding 20px;
  border-radius: 5px;
  box-shadow: 0px 3px 15px rgba(0,0,0,0.01);
  border: 1px solid #d0d0d0;

  :hover {
    cursor: pointer;
  }
`

export default withRouter(Post);