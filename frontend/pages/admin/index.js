import Head from 'next/head';
import { gql, useQuery } from '@apollo/client';
import dynamic from 'next/dynamic'
import Link from 'next/link'

import { Container, Row, Col, Button } from 'react-bootstrap';

import { Header } from '../../components/layout/header';
import { Footer } from '.../../components/layout/footer';
import { PostCard } from '../../components/card';
import { CenterSpinner } from '../../components/spinner';

const GET_POSTS = gql`
  query($secret: String!) {
    editorPosts(secret: $secret) {
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

const Editor = () => {
  const { loading, error, data } = useQuery(
      GET_POSTS,
      { variables: { secret: localStorage.getItem('_password') } }
  );

  return (
    <div>
      <Head>
        <title>Dale Salter</title>
        <link rel="icon" href="https://blog-production-image-bucket.s3-accelerate.amazonaws.com/logo-4.png" />
      </Head>

      <main>
        <Header />

        <Container>
          <Row>
            <Col style={{ padding: 10 }}>
              <h1 style={{ display: 'inline-block'}}>Admin Editor</h1>
              <Link href="/admin/post/create" as='/admin/post/create' passHref >
                <Button className="mt-2" style={{ float: 'right' }} variant="light">Create New Post</Button>
              </Link>
            </Col>
          </Row>   


            {loading && <CenterSpinner animation="grow" />}

            { (data && data.editorPosts || []).map(post => {
              return (
                <Row key={post.postId}>
                  <Col style={{ padding: 10 }}>
                    <PostCard post={post} highlightHover={true} editMode={true}/>
                  </Col>
                </Row>
              );
          })}
        </Container>

        <Footer />
      </main>
    </div>
  )
}

export default dynamic(() => Promise.resolve(Editor), {
    ssr: false
});