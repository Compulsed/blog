import Head from 'next/head';
import dynamic from 'next/dynamic'
import { gql, useQuery } from '@apollo/client';
import { withRouter } from 'next/router'
import Link from 'next/link'

import { Container, Row, Col, Button } from 'react-bootstrap';
import { Header } from '../../../components/layout/header';
import { Footer } from '../../../components/layout/footer';
import { PostCard } from '../../../components/card';
import { CenterSpinner } from '../../../components/spinner';
import { BlogMarkdown } from '../../../components/blog-markdown';

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
    { 
      variables: { postId: router.query.id, secret },
      pollInterval: 2500
    }
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
                  <BlogMarkdown escapeHtml={false} source={post.body} />
                </Col>
              </Row>
            </div>
          )}
        </Container>

        <Footer />
      </main>
    </div>
  )
}

export default dynamic(() => Promise.resolve(withRouter(Post)), {
  ssr: false
});