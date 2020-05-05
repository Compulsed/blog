const { ApolloServer, gql } = require('apollo-server-lambda');

const AWS = require('aws-sdk');
const _ = require('lodash');

const typeDefs = gql`
    type Query {
        hello: String!
    }

    type TableData {
        table_catalog: String
        table_schema: String
        table_name: String
    }

    type Mutation {
        run: [TableData]
    }
`;

const resolvers = {
    Query: {
        hello: () => 'Hello'
    },
    Mutation: {
        run: async (root, args, context) => {
            const data = require('data-api-client')({
                secretArn: process.env.SECRET_ARN,
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