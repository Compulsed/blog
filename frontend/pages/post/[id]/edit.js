import Head from 'next/head';

import { gql, useQuery, useMutation } from '@apollo/client';
import { withRouter } from 'next/router'
import { useRouter } from 'next/router';

import { Button, Form, Container, Spinner } from 'react-bootstrap';

import { Header } from '../../../components/layout/header';
import { CenterSpinner } from '../../../components/spinner';

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

const UPDATE_POST = gql`
    mutation ($postInput: PostInput!, $secret: String!) {
        updatePost (postInput: $postInput, secret: $secret) {
            status
            post {
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
            errorMessage
        }
    }
`;


const PostForm = ({ post }) => {
    const router = useRouter();
    const [updatePost, { data, loading }] = useMutation(UPDATE_POST);

    // Handle Success
    if (data && data.updatePost && data.updatePost.status) {
        router.push(`/post/[id]`, `/post/${data.updatePost.post.postId}`);
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        event.stopPropagation();

        const form = event.currentTarget;

        const postInput = {
            postId: post.postId,
            title: form.elements.title.value,
            imageUrl: form.elements.imageUrl.value,
            shortDescription: form.elements.shortDescription.value,
            longDescription: form.elements.longDescription.value,
            body: form.elements.body.value
        };

        const secret = form.elements.secret.value;

        updatePost({ variables: { postInput, secret } });
    };

    return (
        <Form className="mb-5" onSubmit={handleSubmit}>
            <Form.Group controlId="secret">
                <Form.Label>Secret</Form.Label>
                <Form.Control type="text" />
            </Form.Group>           

            <Form.Group controlId="title">
                <Form.Label>Title</Form.Label>
                <Form.Control type="text"  defaultValue={post.title} />
            </Form.Group>           

            <Form.Group controlId="imageUrl">
                <Form.Label>Image URL</Form.Label>
                <Form.Control type="text"  defaultValue={post.imageUrl} />
            </Form.Group>

            <Form.Group controlId="shortDescription">
                <Form.Label>Short Description</Form.Label>
                <Form.Control as="textarea" rows="1"  defaultValue={post.shortDescription} />
            </Form.Group>

            <Form.Group controlId="longDescription">
                <Form.Label>Long Description</Form.Label>
                <Form.Control as="textarea" rows="3"  defaultValue={post.longDescription}  />
            </Form.Group>

            <hr className="mt-5 mb-5"></hr>

            <Form.Group controlId="body">
                <Form.Label>Body</Form.Label>
                <Form.Control as="textarea" rows="20" defaultValue={post.body}/>
            </Form.Group>                

            <hr className="mt-5 mb-5"></hr>

            <Button variant="primary" type="submit">
                { !loading
                    ? "Submit"
                    : <Spinner animation="border" variant="light" />}
            </Button>
        </Form>
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
        <link rel="icon" href="https://blog-dev-image-bucket.s3.amazonaws.com/logo.png" />
      </Head>

      <main>
        <Header />

        <Container>
          {loading && <CenterSpinner animation="grow" />}

          {!loading && post && (
            <PostForm post={post} />
          )}
        </Container>

      </main>
    </div>
  )
}

export default withRouter(Post);