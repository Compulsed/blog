import Head from 'next/head';

// import { gql, useQuery } from '@apollo/client';
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
      body
      createdAt
      updatedAt
    }
  }
`;

function Post({ router }) {
  // const { loading, error, data } = useQuery(
  //   GET_POSTS,
  //   { variables: { postId: router.query.id } }
  // );

  // if (loading || !data) {
    return <div></div>;
  // }

  // const post = data.post;

  return (
    <div>
      <Head>
        <title>Dale Salter</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <Header />

        <Container>
            <Row>
                <Col style={{ padding: 10 }}>
                  <Title>{ post.title }</Title>
                  <StyledReactMarkdown source={post.body} />
                </Col>
            </Row>
        </Container>

      </main>
    </div>
  )
}

const Title = styled.h2`
  margin-bottom: 20px;
`

const StyledReactMarkdown = styled(ReactMarkdown)`
  border: 1px solid #e3e3e3;
  padding 20px;
  border-radius: 5px;
  box-shadow: 0px 3px 15px rgba(0,0,0,0.01);

  h1 {
    font-size: 20px;
  }
`

export default withRouter(Post);