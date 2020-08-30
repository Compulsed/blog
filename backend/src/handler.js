const { ApolloServer, gql } = require('apollo-server-lambda');
const _ = require('lodash');
const { getPosts } = require('./data/posts');
const { query } = require('./tools/dataApiClient');

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
        post: async (root, { postId }) => {       
            const result = await query(
                `SELECT * FROM "post" WHERE "postId" = :postId::uuid`,
                { postId }
            );

            return result.records[0];
        },

        posts: async () => {
            const result = await query(`SELECT * FROM "post"`);
        
            return result.records;
        },
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