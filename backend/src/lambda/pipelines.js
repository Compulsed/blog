const { knexClient } = require('../tools/knexClient'); 
const { request, GraphQLClient } = require('graphql-request');

const pipelinesQuery = `
    query {
        organization(slug: "dale-salter") {
            id
            name
            pipelines(first: 2) {
                pageInfo {
                    hasNextPage
                    startCursor
                }
                edges {
                    cursor
                    node {
                        id
                        uuid
                        url
                        name
                        description
                        repository {
                            url
                        }
                    }
                }
            }
        }
    }
`

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

const write = async () => {
    const gqlResponse = await getClient()
        .request(pipelinesQuery)

    const inserts = gqlResponse.organization.pipelines.edges.map(({ node }) => {
        return knexClient('buildkite-pipeline')
            .insert({
                uuid: node.uuid,
                data: JSON.stringify({
                    id: node.id,
                    uuid: node.uuid,
                    url: node.url,
                    name: node.name,
                    repository: node.repository,
                }),
            });
    });

    const responses = await Promise.all(inserts); 

    return responses;
}

const read = async () => {
    const response = await knexClient
        .select('uuid', 'data')
        .from('buildkite-pipeline')
        .whereRaw(`"data"->>'name'=?`, ['eng-stats-merge'])

    console.log(JSON.stringify({ response }, null, 2));

    return true; // result.records;
}

const handler = async (event, context) => {
    await write();
};

module.exports = { handler };