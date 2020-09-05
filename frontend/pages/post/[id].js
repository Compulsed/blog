import Head from 'next/head';

import { gql, useQuery } from '@apollo/client';
import { withRouter } from 'next/router'
import Disqus from "disqus-react"

import ReactMarkdown from 'react-markdown/with-html';
import styled from 'styled-components'

import { Container, Row, Col } from 'react-bootstrap';
import { Header } from '../../components/layout/header';
import { PostCard } from '../../components/card';
import { CenterSpinner } from '../../components/spinner';

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
                  <StyledReactMarkdown escapeHtml={false} source={post.body} />
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
    width: 80%;
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