const { ApolloServer, gql } = require('apollo-server-lambda');
const _ = require('lodash');
const { getPosts } = require('./data/posts');
const { query } = require('./tools/dataApiClient');

const typeDefs = gql`
    type Post {
        id: ID!
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
    
    input PostInput {
        postId: String!
        title: String
        body: String
        shortDescription: String
        longDescription: String
        imageUrl: String
    }

    type CreatePostResponse {
        status: Boolean!
        errorMessage: String
        post: Post
    }

    type Mutation {
        createPost (postInput: PostInput!, secret: String!): CreatePostResponse!
    }
`;


const resolvers = {
    Post: {
        id: ({ postId }) => postId,
    },

    Query: {
        post: async (root, { postId }) => {       
            const result = await query(
                `SELECT * FROM "post" WHERE "postId" = :postId::uuid`,
                { postId }
            );

            return result.records[0];
        },

        posts: async () => {
            const result = await query(`SELECT * FROM "post" ORDER BY "createdAt" DESC`);
        
            return result.records;
        },
    },

    // # TODO: Remove duplication
    CreatePostResponse: {
        post: async ({ postId }) => {
            if (!postId) return null;

            const result = await query(
                `SELECT * FROM "post" WHERE "postId" = :postId::uuid`,
                { postId }
            );

            return result && result.records && result.records[0] || null;
        }
    },

    Mutation: {
        createPost: async (root, args, context) => {
            if (args.secret !== 'let me in') {
                return {
                    status: false,
                    errorMessage: 'Invalid Secret',
                };
            }

            const post = {
                postId: args.postInput.postId,
                title: args.postInput.title || null,
                body: args.postInput.body || null,
                shortDescription: args.postInput.shortDescription || null,
                longDescription: args.postInput.longDescription || null,
                imageUrl: args.postInput.imageUrl || null,
                createdAt: new Date().toISOString(),
                updatedAt: null,
            }

            try {
                await query(`
                    INSERT INTO "post" (
                        "postId",
                        "title",
                        "body",
                        "shortDescription",
                        "longDescription",
                        "imageUrl",
                        "createdAt",
                        "updatedAt"
                    )
                    VALUES(
                        :postId::uuid,
                        :title::text,
                        :body::text,
                        :shortDescription::text,
                        :longDescription::text,
                        :imageUrl::text,
                        :createdAt::timestamp,
                        :updatedAt::timestamp         
                    );
                    `,
                    [ post ]
                );

                return {
                    status: true,
                    postId: post.postId,
                };
            } catch (err) {
                return {
                    status: false,
                    errorMessage: err.message,
                };
            }
        }
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