const { knexClient } = require('../tools/knexClient'); 
const { request, GraphQLClient } = require('graphql-request');
const { v4: uuidv4 } = require('uuid');
const lodash = require('lodash')

// TODO: Get pipeline from variable
const pipelinesQuery = `
    query PipelinesAfter ($first: Int, $after: String) {
        organization(slug: "dale-salter") {
            id
            name
            pipelines(first: $first, after: $after) {
                count
                pageInfo {
                    hasNextPage
                    endCursor
                    startCursor
                    hasPreviousPage
                }
                edges {
                    cursor
                    node {
                        id
                        slug
                        uuid
                        url
                        name
                        description
                        createdAt
                        repository {
                            url
                        }
                    }
                }
            }
        }
    }
`
const buildsQuery = `
    query BuildsAfter ($slug: ID!, $first: Int, $after: String) {
        pipeline(slug: $slug) {
            builds (first: $first, after: $after) {
                count
                pageInfo {
                    startCursor
                    hasNextPage
                    endCursor
                    hasPreviousPage
                }
                edges {
                    cursor
                    node {
                        uuid
                        url
                        branch
                        commit
                        message
                        id
                        createdAt
                        pipeline {
                            slug
                        }
                        pullRequest {
                            id
                        }
                        state
                        createdBy {
                          __typename
                          ... on User {
                                name
                          }
                        }
                        finishedAt
                        startedAt
                        number
                        env
                    }
                }
            }
        }
    }
`;

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

const writeBuilds = async pipelineSlug => {
    let builds = [];
    let buildsResponse = null;
    
    do {
        buildsResponse = await getClient().request(buildsQuery, { 
            first: 50,
            after: lodash.get(buildsResponse, 'pipeline.builds.pageInfo.endCursor', null),
            slug: `dale-salter/${pipelineSlug}`
        });

        builds = [
            ...builds,
            ...buildsResponse.pipeline.builds.edges.map(({ node }) => node),
        ]

        console.log(`Builds: ${builds.length}`);
    } while (buildsResponse.pipeline.builds.pageInfo.hasNextPage);

    const buildsInserts = builds.map(node => {
        const query = knexClient.raw(`
            insert into "buildkite-build"
            ("data", "uuid")
            values (?, ?)
            ON CONFLICT (uuid)
            DO UPDATE SET data = excluded.data
            RETURNING *`, [
                JSON.stringify(node),
                node.uuid
            ]
        );
        
        return query;
    });

    const result = await Promise.all(buildsInserts);

    return result;
}

const writePipelines = async () => {
    let pipelines = [];
    let pipelineResponse = null;
    
    do {
        pipelineResponse = await getClient().request(pipelinesQuery, { 
            first: 1,
            after: lodash.get(pipelineResponse, 'organization.pipelines.pageInfo.startCursor', null),
        });

        pipelines = [
            ...pipelines,
            ...pipelineResponse.organization.pipelines.edges.map(({ node }) => node),
        ]
    } while (pipelineResponse.organization.pipelines.pageInfo.hasNextPage);

    const pipelineInserts = pipelines.map(node => {
        const query = knexClient.raw(`
            insert into "buildkite-pipeline"
            ("data", "uuid")
            values (?, ?)
            ON CONFLICT (uuid)
            DO UPDATE SET data = excluded.data
            RETURNING *`, [
                JSON.stringify(node),
                node.uuid
            ]
        );
        
        return query;
    });

    const result = await Promise.all(pipelineInserts); 

    // --

    const buildInserts = await Promise.all(
        pipelines.map(node => writeBuilds(node.slug))
    );

    return;

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
    // await read();
    await writePipelines();
};

module.exports = { handler };