import Head from 'next/head';
import { gql, useQuery } from '@apollo/client';
import dynamic from 'next/dynamic'

import { Container, Row, Col  } from 'react-bootstrap';

import { Header } from '../../components/layout/header';
import { PostCard } from '../../components/card';
import { CenterSpinner } from '../../components/spinner';

const GET_POSTS = gql`
  query($secret: String!) {
    editorPosts(secret: $secret) {
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
      </main>
    </div>
  )
}

export default dynamic(() => Promise.resolve(Editor), {
    ssr: false
});