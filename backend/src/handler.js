const { ApolloServer, gql } = require('apollo-server-lambda');
const _ = require('lodash');

const typeDefs = gql`
    type User {
        email: String
        first_name: String
        last_name: String
    }

    type Post {
        title: String
        body: String
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
    }

    type Mutation {
        run: [TableData]
    }
`;

const POST_BODY = `
    Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.

    It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).
`;

const resolvers = {
    Query: {
        hello: () => 'Hello',

        posts: () => {
            return [
                {
                    title: 'Title - 1', 
                    body: POST_BODY,
                    createdAt: '2020-08-23T12:17:17.278Z',
                    updatedAt: '2020-08-24T12:17:17.278Z'
                },
                {
                    title: 'Title - 2', 
                    body: POST_BODY,
                    createdAt: '2020-08-23T12:17:17.278Z',
                    updatedAt: '2020-08-24T12:17:17.278Z'
                },
                {
                    title: 'Title - 3', 
                    body: POST_BODY,
                    createdAt: '2020-08-23T12:17:17.278Z',
                    updatedAt: '2020-08-24T12:17:17.278Z'
                }                                
            ]
        },
        
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