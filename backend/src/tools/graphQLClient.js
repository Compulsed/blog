const { request, GraphQLClient } = require('graphql-request');

const getClient = () => {
    return new GraphQLClient(
        process.env.BUILDKITE_GRAPHQL_URL,
        {
            headers: {
                Authorization: `Bearer ${process.env.BUILDKITE_GRAPHQL_API_INTEGRATION}`,
            },
        }
    );
};

module.exports = { getClient };