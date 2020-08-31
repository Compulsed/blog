import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { gql, useMutation } from '@apollo/client';
import { v4 as uuidv4 } from 'uuid';

import { Button, Form, Container, Spinner } from 'react-bootstrap';

import { Header } from '../../components/layout/header';

const CREATE_POST = gql`
    mutation ($postInput: PostInput!, $secret: String!) {
        createPost (postInput: $postInput, secret: $secret) {
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

const defaultBodyString = `\
# Sub Lenaee

## Flumina temptantes semianimes esse corpore

Lorem markdownum movet se somni. [Hunc](http://factaexpalluit.org/ventos.html)
sacris, at ignara ausus! Silvani modo est, tinnitibus tempore meque. Greges est,
et arma regnum mortale, et suis, huic carmina arva. Servantis facere.

Iunonis Peneos. Ille deam harundine orbis. Mors cauda sed idque socero ungues
femur moderantur [meque](http://bovis-opem.net/vivebat): illi loca adhuc, iam?

\`\`\`
var of = portalRootkitWindows.baudDocking(kvmAd, pptp_frame);
var chipsetPack = multimedia(e_ebook - 20 - androidSnippet.circuitTftp(3));
ccCard.token_p = digital;
soap_gigabyte = text_memory.user(pipeline_icf, web.heat_rj(5 *
        systray_toggle), sata_flops_boot + character);
\`\`\`


![alt text](https://blog-dev-image-bucket.s3.amazonaws.com/lambda-logo.png "Logo Title From DB Text 1")

Ebrius ostia non, nato [non durat](http://www.aiacem.net/tulisset) poenas
tumebat cultum meritum homines premunt. Ardet hederis, viro, alas saepius,
Priamus duratur. Quia sic choreas, suos: ceperunt vaticinor hoc et illi
accipiunt. Tota resto amatas, secundo at cera qua humilem; quam [muneris
fontis](http://mihi.io/) pessima generis umbras; Aeacus, perdere.

## Frontis numina

Capto **divulsere vertice pastor** numina Troiae Theseu Iuno et meo ergo
crescere tamen, hostiliter in guttura. Accipe mittunt piasque pectora; aevi
Phoebe Palaemona videoque anum **sua quoque**.

1. Ille praedae aristas iura
2. Parte tamen
3. Et atra Euagrus mitibus habenti Memnonides gravitate
4. Habuit talibus venientem enim
`;


const defaultFormValues = {
    title: 'Title From Form',
    imageUrl: 'https://blog-dev-image-bucket.s3.amazonaws.com/lambda-logo.png',
    shortDescription: 'Lorem Ipsum is simply dummy text of the printing',
    longDescription: 'Lorem Ipsum is simply dummy text of the printing Lorem Ipsum is simply dummy text of the printing',
    body: defaultBodyString
}

const PostForm = () => {
    const router = useRouter();
    const [createPost, { data, loading }] = useMutation(CREATE_POST);

    // Handle Success
    if (data && data.createPost && data.createPost.status) {
        router.push(`/post/[id]`, `/post/${data.createPost.post.postId}`);
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        event.stopPropagation();

        const form = event.currentTarget;

        const postInput = {
            postId: uuidv4(),
            title: form.elements.title.value,
            imageUrl: form.elements.imageUrl.value,
            shortDescription: form.elements.shortDescription.value,
            longDescription: form.elements.longDescription.value,
            body: form.elements.body.value
        };

        const secret = form.elements.secret.value;

        createPost({ variables: { postInput, secret } });
    };

    return (
        <Form className="mb-5" onSubmit={handleSubmit}>
            <Form.Group controlId="secret">
                <Form.Label>Secret</Form.Label>
                <Form.Control type="text" />
            </Form.Group>           

            <Form.Group controlId="title">
                <Form.Label>Title</Form.Label>
                <Form.Control type="text"  defaultValue={defaultFormValues.title} />
            </Form.Group>           

            <Form.Group controlId="imageUrl">
                <Form.Label>Image URL</Form.Label>
                <Form.Control type="text"  defaultValue={defaultFormValues.imageUrl} />
            </Form.Group>

            <Form.Group controlId="shortDescription">
                <Form.Label>Short Description</Form.Label>
                <Form.Control as="textarea" rows="1"  defaultValue={defaultFormValues.shortDescription} />
            </Form.Group>

            <Form.Group controlId="longDescription">
                <Form.Label>Long Description</Form.Label>
                <Form.Control as="textarea" rows="3"  defaultValue={defaultFormValues.longDescription}  />
            </Form.Group>

            <hr className="mt-5 mb-5"></hr>

            <Form.Group controlId="body">
                <Form.Label>Body</Form.Label>
                <Form.Control as="textarea" rows="20" defaultValue={defaultFormValues.body}/>
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

function Post() {
  return (
    <div>
      <Head>
        <title>Dale Salter</title>
        <link rel="icon" href="https://blog-production-image-bucket.s3.amazonaws.com/logo-2.png" />
      </Head>

      <main>
        <Header />

        <Container>
            <h1 className="mb-5">New Post</h1>

            <PostForm />
        </Container>

      </main>
    </div>
  )
}



export default Post;