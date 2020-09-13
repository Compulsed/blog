import React, { useCallback, useState, useEffect } from 'react';
import Head from 'next/head';
import dynamic from 'next/dynamic'
import { withRouter } from 'next/router'
import autosize from 'autosize';
import { useDebouncedCallback } from 'use-debounce';

import { useDropzone } from 'react-dropzone'
import { gql, useQuery, useMutation, useApolloClient } from '@apollo/client';
import { Button, Form, Container, Row, Col, Spinner, Badge } from 'react-bootstrap';
import { Header } from '../../../../components/layout/header';
import { Footer } from '../../../../components/layout/footer';
import { CenterSpinner } from '../../../../components/spinner';
import { POST_FRAGMENT } from '../../../../libs/fragments';

import axios from 'axios';

const GET_SIGNED_URL = gql`
  query ($secret: String!, $fileName: String!, $contentType: String!) {
    editorSignedUrl (secret: $secret, fileName: $fileName, contentType: $contentType)
  }
`;

const GET_POST = gql`
  query($postId: String!, $secret: String!) {
    editorPost(postId: $postId, secret: $secret) {
      ...PostParts
    }
  }

  ${POST_FRAGMENT}
`;

const UPDATE_POST = gql`
    mutation ($postInput: PostInput!, $secret: String!) {
        updatePost (postInput: $postInput, secret: $secret) {
            status
            post {
              ...PostParts
            }
            errorMessage
        }
    }

    ${POST_FRAGMENT}
`;

const HIDE_POST = gql`
  mutation ($postId: String!, $secret: String!) {
      hidePost (postId: $postId, secret: $secret) {
          status
          post {
            ...PostParts
          }
          errorMessage
      }
  }

  ${POST_FRAGMENT}
`;

const UNHIDE_POST = gql`
    mutation ($postId: String!, $secret: String!) {
        unhidePost (postId: $postId, secret: $secret) {
            status
            post {
              ...PostParts
            }
            errorMessage
        }
    }

    ${POST_FRAGMENT}
`;

const PUBLISH_POST = gql`
    mutation ($postId: String!, $secret: String!) {
        publishPost (postId: $postId, secret: $secret) {
            status
            post {
              ...PostParts
            }
            errorMessage
        }
    }
    ${POST_FRAGMENT}
`;

const SET_AVAILABLE_WITH_LINK = gql`
    mutation ($postId: String!, $secret: String!) {
        setAvailableWithLink (postId: $postId, secret: $secret) {
          status
          post {
            ...PostParts
          }
          errorMessage
        }
    }
    ${POST_FRAGMENT}
`;

const REMOVE_AVAILABLE_WITH_LINK = gql`
    mutation ($postId: String!, $secret: String!) {
        removeAvailableWithLink (postId: $postId, secret: $secret) {
          status
          post {
            ...PostParts
          }
          errorMessage
        }
    }
    ${POST_FRAGMENT}
`;

const ImageUploader = () => {
  const client = useApolloClient();
  const [files, setFiles] = useState([]);
  const [uploadUrl, setUploadUrl] = useState('');
  const [updateState, setUploadState] = useState(false);

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
    maxSize: 5368709120 // 5Gb
  });

  const onUpload = async e => {
    setUploadUrl('');
    setUploadState(true);

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
    setUploadState(false);
  };

  return (
    <>
      <Container {...getRootProps()} style={{ display: 'inline' }}>
        <Button variant="light">
          Upload
        </Button>
        <input {...getInputProps()} />
      </Container>

      <Button variant="dark" disabled={updateState} onClick={onUpload}>
        Submit
      </Button>

      <span className="ml-2">{ uploadUrl }</span>      
    </>
  );
};


const PostForm = ({ post }) => {   
    const [updatePost, { data: updatePostData, loading: updatePostLoading }] = useMutation(UPDATE_POST);
    const [hidePost, { data: hidePostData, loading: hidePostloading }] = useMutation(HIDE_POST);
    const [unhidePost, { data: unhidePostData, loading: unhidePostloading }] = useMutation(UNHIDE_POST);
    const [publishPost, { data: publishPostData, loading: publishPostloading }] = useMutation(PUBLISH_POST);
    const [setAvailableWithLink, { data: setAvailableWithLinkData, loading: setAvailableWithLinkLoading }] = useMutation(SET_AVAILABLE_WITH_LINK);
    const [removeAvailableWithLink, { data: removeAvailableWithLinkData, loading: removeAvailableWithLinkLoading }] = useMutation(REMOVE_AVAILABLE_WITH_LINK);

    const [debouncedUpdatePost] = useDebouncedCallback(updatePost, 5000);

    const loading = (
      updatePostLoading ||
      hidePostloading ||
      publishPostloading ||
      unhidePostloading ||
      setAvailableWithLinkLoading ||
      removeAvailableWithLinkLoading
    );

    const handleFormAction = (type, event) => {
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

      if (post.publishStatus !== 'PUBLISHED' && type === 'change') {
        debouncedUpdatePost({ variables: { postInput, secret } });
      }

      if (type === 'submit') {
        updatePost({ variables: { postInput, secret } });
      }
    };

    const handlePostVisibilityOption = (action) => {
      const secret = localStorage.getItem('_password');

      switch (action) {
        case 'PUBLISH': {
          if (confirm('Are you sure you want to publish this post?')) {
             publishPost({ variables: { postId: post.postId, secret } });
          }
        }
        case 'HIDE': {
          if (confirm('Are you sure you want to hide this post?')) {
            hidePost({ variables: { postId: post.postId, secret } });
          }
          return;
        }

        case 'UNHIDE': {
          if (confirm('Are you sure you want to unhide this post?')) {
            unhidePost({ variables: { postId: post.postId, secret } });
          }
          return;
        }
        default: console.log('Unsupported publish action');
      }
    }

    const handleLinkAvailability = (action) => {
      const secret = localStorage.getItem('_password');

      switch (action) {
        case 'SET': {
          return setAvailableWithLink({ variables: { postId: post.postId, secret } });
        }
        case 'REMOVE': {
          return removeAvailableWithLink({ variables: { postId: post.postId, secret } });
        }
        default: console.log('Unsupported publish action');
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
                  <Badge variant="light">DRAFT{ post.availableWithLink && ', LINKABLE' }</Badge>
              }
              { post.publishStatus === 'HIDDEN' &&
                <Badge variant="dark">HIDDEN{ post.availableWithLink && ', LINKABLE' }</Badge>
              }                
            </Col>

            <Col sm={6}>
              { (post.publishStatus !== 'PUBLISHED' && post.availableWithLink === false) &&
                <Button className="ml-2" style={{ float: 'right' }} variant="light" onClick={() => handleLinkAvailability('SET')}>
                { !loading
                    ? "Allow Public Link"
                    : <Spinner size="sm" animation="border" variant="dark" />}
                </Button>
              }

              { (post.publishStatus !== 'PUBLISHED' && post.availableWithLink === true) &&
                <Button className="ml-2" style={{ float: 'right' }} variant="light" onClick={() => handleLinkAvailability('REMOVE')}>
                { !loading
                    ? "Delete Public Link"
                    : <Spinner size="sm" animation="border" variant="dark" />}
                </Button>
              }

              { post.publishStatus === 'PUBLISHED' &&
                <Button className="ml-2" style={{ float: 'right' }} variant="light" onClick={() => handlePostVisibilityOption('HIDE')}>
                { !loading
                    ? "Hide"
                    : <Spinner size="sm" animation="border" variant="dark" />}
                </Button>
              }

              { post.publishStatus === 'DRAFT' &&
                <Button className="ml-2" style={{ float: 'right' }} variant="light" onClick={() => handlePostVisibilityOption('PUBLISH')}>
                { !loading
                    ? "Publish"
                    : <Spinner size="sm" animation="border" variant="dark" />}
                </Button>
              }

              { post.publishStatus === 'HIDDEN' &&
                <Button className="ml-2" style={{ float: 'right' }} variant="light" onClick={() => handlePostVisibilityOption('UNHIDE')}>
                { !loading
                    ? "Unhide"
                    : <Spinner size="sm" animation="border" variant="dark" />}
                </Button>
              }  
            </Col>
          </ Row>

          <Form className="mb-5" onSubmit={e => handleFormAction('submit', e)} onChange={e => handleFormAction('change', e)}>
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

              <Form.Group className="mb-5" controlId="longDescription">
                  <Form.Label>Long Description</Form.Label>
                  <Form.Control as="textarea" rows="3"  defaultValue={post.longDescription}  />
              </Form.Group>

              <Form.Group controlId="body">
                  <Form.Label>Body</Form.Label>
                  <Form.Control as="textarea" rows="50" defaultValue={post.body} />
              </Form.Group>                

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

          <hr className="mt-5 mb-2"></hr>
            <h4>Image Uploader</h4>
            <ImageUploader />
          <hr className="mt-2 mb-5"></hr>

        </div>           
    )
}


function Post({ router }) {
  const { loading, error, data } = useQuery(
    GET_POST,
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

        <Footer />
      </main>
    </div>
  )
}

export default dynamic(() => Promise.resolve(withRouter(Post)), {
  ssr: false
});