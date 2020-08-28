// import Head from 'next/head'

// import gql from 'graphql-tag';
// import { getStandaloneApolloClient } from '../../libs/get-standalone-apollo-client';

// import {
//   Container,
//   Row,
//   Col,
//   Card 
// } from 'react-bootstrap';


// export const getServerSideProps = async ({ params }) => {
//   const client = await getStandaloneApolloClient();

//   await client.query({
//     query: gql`
//       query($postId: String!) {
//         post(postId: $postId) {
//           postId
//           title
//           shortDescription
//           body
//           createdAt
//           updatedAt
//         }
//       }
//     `,
//     variables: { postId: params?.id }
//   });

//   return {
//     props: {
//       apolloStaticCache: client.cache.extract()
//     }
//   };
// };


// export default function Post(query) {
//   // const { post } = query.apolloStaticCache.ROOT_QUERY;
//   const post = {};

//   console.log(query);

//   return (
//     <div>
//       <Head>
//         <title>Dale Salter</title>
//         <link rel="icon" href="/favicon.ico" />
//       </Head>

//       <main>
//         <Container style={{ marginTop: 30 }}>
//           <h1 className="title">
//             Dale Salter
//           </h1>
//         </Container>

//         <Container>
//             <Row>
//                 <Col style={{ padding: 10 }}>
//                     <Card>
//                         <Card.Body>
//                         <Card.Title>{ post.title }</Card.Title>
//                         <Card.Subtitle className="mb-2 text-muted">Card Subtitle</Card.Subtitle>
//                         <Card.Text>
//                             Some quick example text to build on the card title and make up the bulk of
//                             the card's content.
//                         </Card.Text>
//                         <Card.Link href="#">Card Link</Card.Link>
//                         <Card.Link href="#">Another Link</Card.Link>
//                         </Card.Body>
//                     </Card>
//                 </Col>
//             </Row>
//         </Container>
//       </main>
//     </div>
//   )
// }
