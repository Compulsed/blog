const { knexClient } = require('../tools/knexClient'); 
const { getClient } = require('../tools/graphQLClient');
const lodash = require('lodash');
const { indexPipelineBuilds } = require('./build');
const { logger } = require('../tools/logger');

const pipelinesQuery = `
    query PipelinesQuery ($organizationSlug: ID!, $first: Int, $after: String) {
        organization(slug: $organizationSlug) {
            id
            name
            pipelines(first: $first, after: $after) {
                count
                pageInfo {
                    hasNextPage
                    endCursor
                }
                edges {
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
`;

const writePipelines = async () => {
    logger.warn('writePipelines');

    let pipelines = [];
    let pipelineResponse = null;

    do {
        pipelineResponse = await getClient().request(pipelinesQuery, { 
            first: 1,
            after: lodash.get(pipelineResponse, 'organization.pipelines.pageInfo.endCursor', null),
            organizationSlug: 'dale-salter', // TODO: Organisation from env
        });

        pipelines = [
            ...pipelines,
            ...pipelineResponse.organization.pipelines.edges.map(({ node }) => node),
        ];
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

    await Promise.all(pipelineInserts); 

    const buildInserts = await Promise.all(
        pipelines.map(node => indexPipelineBuilds(node.slug))
    );

    return buildInserts;
}

module.exports = { writePipelines };