const { ApolloServer, gql } = require('apollo-server-lambda');
const _ = require('lodash');
const { posts } = require('./data/posts');

const typeDefs = gql`
    type User {
        email: String
        first_name: String
        last_name: String
    }

    type Post {
        postId: String
        title: String
        body: String
        shortDescription: String
        createdAt: String
        updatedAt: String
    }

    type TableData {
        table_catalog: String
        table_schema: String
        table_name: String
    }

    type Query {
        hello: String!
        users: [User]
        
        posts: [Post]
        post(postId: String!): Post!
    }

    type Mutation {
        run: [TableData]
    }
`;


const resolvers = {
    Query: {
        post: (root, { postId }) => {
            console.log(JSON.stringify(_.find(posts, { postId })));
            
            return _.find(posts, { postId });
        },

        posts: () => posts,
        
        users: async () => {
            const data = require('data-api-client')({
                secretArn: process.env.SECRET_ARN || process.env.SECRET_ARN_REF,
                resourceArn: process.env.DB_ARN,
                database: process.env.DATABASE_NAME,
            });

            const result = await data.query(`
                SELECT * FROM users
            `);

            return result.records;

        }
    },
    Mutation: {
        run: async (root, args, context) => {
            const data = require('data-api-client')({
                secretArn: process.env.SECRET_ARN || process.env.SECRET_ARN_REF,
                resourceArn: process.env.DB_ARN,
                database: process.env.DATABASE_NAME,
            });

            const result = await data.query(`
                SELECT *
                FROM information_schema.tables
                ORDER BY table_name;
            `);

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