import React, { useCallback, useState } from 'react';
import Head from 'next/head';
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router';
import { withRouter } from 'next/router'

import { useDropzone } from 'react-dropzone'
import { gql, useQuery, useMutation, useApolloClient } from '@apollo/client';
import { Button, Form, Container, Row, Col, Spinner, Badge } from 'react-bootstrap';
import { Header } from '../../../../components/layout/header';
import { CenterSpinner } from '../../../../components/spinner';
import { initApolloClient } from '../../../../libs/init-apollo-client';

import axios from 'axios';

const GET_SIGNED_URL = gql`
  query ($secret: String!, $fileName: String!, $contentType: String!) {
    editorSignedUrl (secret: $secret, fileName: $fileName, contentType: $contentType)
  }
`;

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
                publishStatus
            }
            errorMessage
        }
    }
`;

const HIDE_POST = gql`
    mutation ($postId: String!, $secret: String!) {
        hidePost (postId: $postId, secret: $secret) {
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
                publishStatus
            }
            errorMessage
        }
    }
`;

const PUBLISH_POST = gql`
    mutation ($postId: String!, $secret: String!) {
        publishPost (postId: $postId, secret: $secret) {
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
                publishStatus
            }
            errorMessage
        }
    }
`;

const ImageUploader = () => {
  const client = useApolloClient();
  const [files, setFiles] = useState([]);
  const [uploadUrl, setUploadUrl] = useState();

  const onDrop = useCallback(acceptedFiles => {
    setFiles(
      acceptedFiles.map(file =>
        Object.assign(file, {
          preview: URL.createObjectURL(file)
        })
      )
    );
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    maxSize: 5368709120, // 5Gb
    accept: 'image/jpeg, image/jpg, image/png'
  });

  const onUpload = async e => {
    setUploadUrl('');

    const file = files[0];

    const result = await client.query({ 
      query: GET_SIGNED_URL,
      fetchPolicy: 'no-cache',
      variables: { fileName: file.name, contentType: file.type, secret: localStorage.getItem('_password') }
    });

    await axios
      .put(result.data.editorSignedUrl, file, { headers: { 'Content-Type': file.type } })
      .then(response => response.statusText === 'OK');

    setUploadUrl(result.data.editorSignedUrl.split('?')[0].replace('.s3.', '.s3-accelerate.'));
  };

  return (
    <>
      <Container {...getRootProps()} style={{ display: 'inline' }}>
        <Button variant="light">
          Upload
        </Button>
        <input {...getInputProps()} />
      </Container>

      <Button variant="dark" onClick={onUpload}>
        Submit
      </Button>

      <span className="ml-2">{ uploadUrl }</span>      
    </>
  );
};


const PostForm = ({ post }) => {   
    const [updatePost, { data: updatePostData, loading: updatePostLoading }] = useMutation(UPDATE_POST);
    const [hidePost, { data: hidePostData, loading: hidePostloading }] = useMutation(HIDE_POST);
    const [publishPost, { data: publishPostData, loading: publishPostloading }] = useMutation(PUBLISH_POST);

    const loading = updatePostLoading || hidePostloading || publishPostloading;

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

        const secret = localStorage.getItem('_password');

        updatePost({ variables: { postInput, secret } });
    };

    const handlePublishAction = (action) => {
      const secret = localStorage.getItem('_password');

      if (action === 'HIDE') {
        hidePost({ variables: { postId: post.postId, secret } });
      }

      if (action === 'PUBLISH') {
        if (confirm('Are you sure you want to post this?')){
          publishPost({ variables: { postId: post.postId, secret } });
        }
      }
    }

    return (
        <div>
          <Row className="mb-2">
            <Col sm={6}>
              { post.publishStatus === 'PUBLISHED' &&
                  <Badge variant="primary">PUBLISHED</Badge>
              }              
              { post.publishStatus === 'DRAFT' &&
                  <Badge variant="light">DRAFT</Badge>
              }
              { post.publishStatus === 'HIDDEN' &&
                  <Badge variant="dark">HIDDEN</Badge>
              }                
            </Col>

            <Col sm={6}>
              { post.publishStatus === 'PUBLISHED' &&
                <Button className="ml-2" style={{ float: 'right' }} variant="light" onClick={() => handlePublishAction('HIDE')}>
                { !loading
                    ? "Hide"
                    : <Spinner size="sm" animation="border" variant="dark" />}
                </Button>
              }

              { post.publishStatus === 'DRAFT' &&
                <Button className="ml-2" style={{ float: 'right' }} variant="light" onClick={() => handlePublishAction('PUBLISH')}>
                { !loading
                    ? "Publish"
                    : <Spinner size="sm" animation="border" variant="dark" />}
                </Button>
              }

              { post.publishStatus === 'HIDDEN' &&
                <Button className="ml-2" style={{ float: 'right' }} variant="light" onClick={() => handlePublishAction('PUBLISH')}>
                { !loading
                    ? "Re-Publish"
                    : <Spinner size="sm" animation="border" variant="dark" />}
                </Button>
              }  
            </Col>
          </ Row>

          <Form className="mb-5" onSubmit={handleSubmit}>
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

              <hr className="mt-5 mb-2"></hr>
                <ImageUploader />
              <hr className="mt-2 mb-5"></hr>

              <div>
                <Button variant="dark" type="submit">
                    { !loading
                        ? "Update"
                        : <Spinner size="sm" animation="border" variant="light" />}
                </Button>
                <span className="ml-2">
                  { updatePostData?.updatePost?.status === true && 'Successfully Updated' }
                  { updatePostData?.updatePost?.status === false && updatePostData?.updatePost?.errorMessage }
                </span>
              </div>
              
          </Form>
        </div>   
    )
}


function Post({ router }) {
  const { loading, error, data } = useQuery(
    GET_POSTS,
    { variables: { postId: router.query.id, secret: localStorage.getItem('_password') } }
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
            <PostForm post={post} />
          )}
        </Container>

      </main>
    </div>
  )
}

export default dynamic(() => Promise.resolve(withRouter(Post)), {
  ssr: false
});