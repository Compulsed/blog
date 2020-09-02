import Head from 'next/head';
import dynamic from 'next/dynamic'
import { gql, useQuery } from '@apollo/client';
import { withRouter } from 'next/router'
import Link from 'next/link'

import ReactMarkdown from 'react-markdown';
import styled from 'styled-components'

import { Container, Row, Col, Button } from 'react-bootstrap';
import { Header } from '../../../components/layout/header';
import { PostCard } from '../../../components/card';
import { CenterSpinner } from '../../../components/spinner';

const GET_POSTS = gql`
  query($postId: String!, $secret: String!) {
    editorPost(postId: $postId, secret: $secret) {
      id
      postId
      title
      shortDescription
      longDescription
      imageUrl
      body
      createdAt
      updatedAt
      publishStatus
    }
  }
`;

function Post({ router }) {
  const secret = localStorage.getItem('_password');

  const { loading, error, data } = useQuery(
    GET_POSTS,
    { variables: { postId: router.query.id, secret } }
  );

  const post = data && data.editorPost;

  return (
    <div>
      <Head>
        <title>Dale Salter</title>
        <link rel="icon" href="https://blog-production-image-bucket.s3-accelerate.amazonaws.com/logo-4.png" />
      </Head>

      <main>
        <Header />

        <Container>
          {loading && <CenterSpinner animation="grow" />}

          {!loading && post && (
            <div>
              <Row>
                <Col style={{ padding: 10 }}>
                  <h1 style={{ display: 'inline-block'}}>Post Editor</h1>
                  <Link href="/admin/post/[id]/edit" as={`/admin/post/${post.postId}/edit`} passHref >
                    <Button className="mt-2" style={{ float: 'right' }} variant="light">Edit</Button>
                  </Link>
                </Col>
              </Row>

              <Row key={post.postId}>
                <Col style={{ padding: 10 }}>
                  <PostCard post={post} highlightHover={false} editMode={true}/>
                </Col>
              </Row>              
              <Row>
                <Col style={{ padding: 10 }}>
                  <StyledReactMarkdown source={post.body} />
                </Col>
              </Row>
            </div>
          )}
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

export default dynamic(() => Promise.resolve(withRouter(Post)), {
  ssr: false
});