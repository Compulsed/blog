import Head from 'next/head';

import { gql, useQuery } from '@apollo/client';
import { withRouter } from 'next/router'
import Disqus from "disqus-react"

import { Container, Row, Col } from 'react-bootstrap';
import { Header } from '../../components/layout/header';
import { Footer } from '../../components/layout/footer';
import { PostCard } from '../../components/card';
import { CenterSpinner } from '../../components/spinner';
import { BlogMarkdown } from '../../components/blog-markdown';

const GET_POSTS = gql`
  query($postId: String!) {
    post(postId: $postId) {
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

const DisqusComponent = ({ post }) => {
  const disqusShortname = 'dalejsalter';

  const disqusConfig = {
    url: `https://dalejsalter.com/post/${post.postId}`,
    identifier: post.postId,
    title: post.title
  }

  return (
    <Disqus.DiscussionEmbed
      shortname={disqusShortname}
      config={disqusConfig}
    />
  )
}


function Post({ router }) {
  const { loading, error, data } = useQuery(
    GET_POSTS,
    { variables: { postId: router.query.id } }
  );

  const post = data && data.post;

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
              <Row key={post.postId}>
                <Col style={{ padding: 10 }}>
                  <PostCard post={post} highlightHover={false}/>
                </Col>
              </Row>              
              <Row>
                <Col style={{ padding: 10 }}>
                  <BlogMarkdown escapeHtml={false} source={post.body} />
                </Col>
              </Row>
              <Row>
              <Col style={{ padding: 10 }}>
                <DisqusComponent post={post} />
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

export default withRouter(Post);