import Head from 'next/head';
import { gql, useQuery } from '@apollo/client';

import { Container, Row, Col  } from 'react-bootstrap';

import { Header } from '../components/layout/header';
import { Footer } from '../components/layout/footer';
import { PostCard } from '../components/card';
import { CenterSpinner } from '../components/spinner';

const GET_POSTS = gql`
  query {
    posts {
      id
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
  const { loading, error, data } = useQuery(GET_POSTS);

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

            { (data && data.posts || []).map(post => {
              return (
                <Row key={post.postId}>
                  <Col style={{ padding: 10 }}>
                    <PostCard post={post} highlightHover={true}/>
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