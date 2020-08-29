const { ApolloServer, gql } = require('apollo-server-lambda');
const _ = require('lodash');
const { getPosts } = require('./data/posts');

const typeDefs = gql`
    type Post {
        postId: String
        title: String
        body: String
        shortDescription: String
        longDescription: String
        imageUrl: String
        createdAt: String
        updatedAt: String
    }

    type Query {
        hello: String!

        posts: [Post]
        post(postId: String!): Post!
    }
`;


const resolvers = {
    Query: {
        post: (root, { postId }) => {
            console.log(JSON.stringify(_.find(getPosts(), { postId })));
            
            return _.find(getPosts(), { postId });
        },

        posts: () => getPosts(),
    }
};

const server = new ApolloServer({
    typeDefs,
    resolvers,
});

const handler = (event, context, callback) => {
    console.log(JSON.stringify({ event, context }));

    const handler = server.createHandler({
        cors: {
            origin: '*'
        },
    });

    handler(event, context, callback);
};

module.exports = { handler };