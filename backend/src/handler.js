const { ApolloServer, gql } = require('apollo-server-lambda');
const _ = require('lodash');
const { queryWithCache, queryNoCache, queryMutation } = require('./tools/dataApiClient');
const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');

const s3 = new AWS.S3();

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
        publishStatus: String
        availableWithLink: Boolean
    }   

    type Query {
        hello: String!

        post(postId: String!): Post
        posts: [Post]

        editorPost(postId: String!, secret: String!): Post
        editorPosts(secret: String!): [Post]

        editorSignedUrl(fileName: String!, secret: String!, contentType: String!): String
    }
    
    input PostInput {
        postId: String!
        title: String
        body: String
        shortDescription: String
        longDescription: String
        imageUrl: String
    }

    type UpdatePostResponse {
        status: Boolean!
        errorMessage: String
        post: Post
    }

    type Mutation {
        createPost (postInput: PostInput!, secret: String!): UpdatePostResponse!
        updatePost (postInput: PostInput!, secret: String!): UpdatePostResponse!
        publishPost (postId: String!, secret: String!): UpdatePostResponse!
        hidePost (postId: String!, secret: String!): UpdatePostResponse!
        unhidePost (postId: String!, secret: String!): UpdatePostResponse!
        setAvailableWithLink (postId: String!, secret: String!): UpdatePostResponse!
        removeAvailableWithLink (postId: String!, secret: String!): UpdatePostResponse!
    }
`;


const resolvers = {
    Post: {
        id: ({ postId }) => postId,
        createdAt: ({ createdAt }) => createdAt && createdAt.replace(' ', 'T') + 'Z', // Convert to ISO string form postgres
        updatedAt: ({ updatedAt }) => updatedAt && updatedAt.replace(' ', 'T') + 'Z', // Convert to ISO string form postgres
    },

    Query: {
        post: async (root, { postId }) => {
            const result = await queryWithCache(`
                SELECT
                    *
                FROM
                    "post"
                WHERE
                    "postId" = :postId::uuid AND ("publishStatus" = 'PUBLISHED' OR "availableWithLink" = true)`,
                { postId }
            );

            return result.records[0];
        },

        editorPost: async (root, { postId, secret }) => {
            if (secret !== process.env.FRONTEND_AUTH_SECRET) {
                return [];
            }

            const result = await queryNoCache(`
                SELECT
                    *
                FROM
                    "post"
                WHERE
                    "postId" = :postId::uuid`,
                { postId }
            );

            return result.records[0];
        },

        posts: async () => {
            const result = await queryWithCache(`
                SELECT
                    *
                FROM
                    "post"
                WHERE
                    "publishStatus" = 'PUBLISHED'   
                ORDER BY
                    "createdAt"
                DESC;
            `);
        
            return result.records;
        },

        editorPosts: async (root, { secret }) => {
            if (secret !== process.env.FRONTEND_AUTH_SECRET) {
                return null;
            }

            const result = await queryNoCache(`
                SELECT
                    *
                FROM
                    "post"
                ORDER BY
                    "createdAt"
                DESC;
            `);
        
            return result.records;
        },


        editorSignedUrl: async (root, { fileName, secret, contentType }) => {
            if (secret !== process.env.FRONTEND_AUTH_SECRET) {
                return null;
            }

            const params = {
                Bucket: process.env.IMAGE_BUCKET_NAME,
                Key: `${uuidv4()}-${fileName}`,
                ContentType: contentType,
            };
            
            const url = await s3
                .getSignedUrlPromise('putObject', params);

            return url;
        }
    },

    UpdatePostResponse: {
        post: async ({ postId }) => {
            if (!postId) return null;

            const result = await queryNoCache(
                `SELECT * FROM "post" WHERE "postId" = :postId::uuid`,
                { postId }
            );

            return result && result.records && result.records[0] || null;
        }
    },

    Mutation: {
        createPost: async (root, args, context) => {
            if (args.secret !== process.env.FRONTEND_AUTH_SECRET) {
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
                await queryMutation(`
                    INSERT INTO "post" (
                        "postId",
                        "title",
                        "body",
                        "shortDescription",
                        "longDescription",
                        "imageUrl",
                        "createdAt",
                        "updatedAt",
                        "publishStatus"
                    )
                    VALUES(
                        :postId::uuid,
                        :title::text,
                        :body::text,
                        :shortDescription::text,
                        :longDescription::text,
                        :imageUrl::text,
                        :createdAt::timestamp,
                        :updatedAt::timestamp,
                        'DRAFT'
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
        },
        updatePost: async (root, args, context) => {
            if (args.secret !== process.env.FRONTEND_AUTH_SECRET) {
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
                updatedAt: new Date().toISOString(),
            }

            try {
                await queryMutation(`
                    UPDATE
                        "post"
                    SET 
                        "title"             = :title::text,
                        "body"              = :body::text,
                        "shortDescription"  = :shortDescription::text,
                        "longDescription"   = :longDescription::text,
                        "imageUrl"          = :imageUrl::text,
                        "updatedAt"         = :updatedAt::timestamp
                    WHERE
                        "postId" = :postId::uuid;
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
        },
        publishPost: async (root, args, context) => {
            if (args.secret !== process.env.FRONTEND_AUTH_SECRET) {
                return {
                    status: false,
                    errorMessage: 'Invalid Secret',
                };
            }

            const postId = args.postId;

            try {
                await queryMutation(`
                    UPDATE
                        "post"
                    SET 
                        "publishStatus"     = 'PUBLISHED',
                        "createdAt"         = :createdAt::timestamp,
                        "updatedAt"         = null
                    WHERE
                        "postId" = :postId::uuid AND 'DRAFT';
                    `,
                    [ { postId, createdAt: new Date().toISOString() } ]
                );

                return {
                    status: true,
                    postId,
                };
            } catch (err) {
                return {
                    status: false,
                    errorMessage: err.message,
                };
            }
        },
        hidePost: async (root, args, context) => {
            if (args.secret !== process.env.FRONTEND_AUTH_SECRET) {
                return {
                    status: false,
                    errorMessage: 'Invalid Secret',
                };
            }

            const postId = args.postId;

            try {
                await queryMutation(`
                    UPDATE
                        "post"
                    SET 
                        "publishStatus" = 'HIDDEN'
                    WHERE
                        "postId" = :postId::uuid AND "publishStatus" = 'PUBLISHED';
                    `,
                    [ { postId } ]
                );

                return {
                    status: true,
                    postId,
                };
            } catch (err) {
                return {
                    status: false,
                    errorMessage: err.message,
                };
            }
        },
        unhidePost: async (root, args, context) => {
            if (args.secret !== process.env.FRONTEND_AUTH_SECRET) {
                return {
                    status: false,
                    errorMessage: 'Invalid Secret',
                };
            }

            const postId = args.postId;

            try {
                await queryMutation(`
                    UPDATE
                        "post"
                    SET 
                        "publishStatus" = 'PUBLISHED'
                    WHERE
                        "postId" = :postId::uuid AND "publishStatus" = 'HIDDEN';
                    `,
                    [ { postId } ]
                );

                return {
                    status: true,
                    postId,
                };
            } catch (err) {
                return {
                    status: false,
                    errorMessage: err.message,
                };
            }
        },

        setAvailableWithLink: async (root, args, context) => {
            if (args.secret !== process.env.FRONTEND_AUTH_SECRET) {
                return {
                    status: false,
                    errorMessage: 'Invalid Secret',
                };
            }

            const postId = args.postId;

            try {
                await queryMutation(`
                    UPDATE
                        "post"
                    SET 
                        "availableWithLink" = true
                    WHERE
                        "postId" = :postId::uuid;
                    `,
                    [ { postId } ]
                );

                return {
                    status: true,
                    postId,
                };
            } catch (err) {
                return {
                    status: false,
                    errorMessage: err.message,
                };
            }
        },

        removeAvailableWithLink: async (root, args, context) => {
            if (args.secret !== process.env.FRONTEND_AUTH_SECRET) {
                return {
                    status: false,
                    errorMessage: 'Invalid Secret',
                };
            }

            const postId = args.postId;

            try {
                await queryMutation(`
                    UPDATE
                        "post"
                    SET 
                        "availableWithLink" = false
                    WHERE
                        "postId" = :postId::uuid;
                    `,
                    [ { postId } ]
                );

                return {
                    status: true,
                    postId,
                };
            } catch (err) {
                return {
                    status: false,
                    errorMessage: err.message,
                };
            }
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