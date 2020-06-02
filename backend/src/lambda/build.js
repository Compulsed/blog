const { query } = require('../tools/dataApiClient');
const { getClient } = require('../tools/graphQLClient');
const lodash = require('lodash')
const { logger } = require('../tools/logger');

const buildFragment = `
    fragment BuildFragment on Build {
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
`;

const buildsQuery = `
    query BuildsQuery ($pipelineSlug: ID!, $first: Int, $after: String) {
        pipeline(slug: $pipelineSlug) {
            builds (first: $first, after: $after) {
                count
                pageInfo {
                    hasNextPage
                    endCursor
                }
                edges {
                    node {
                        ...BuildFragment
                    }
                }
            }
        }
    }
    ${buildFragment}
`;

const indexBuild = async (buildUuid) => {
    logger.info('indexBuild: ', buildUuid);

    const buildByUuidQuery = `
        query buildByUuid($buildUuid: ID!) {
            build(uuid: $buildUuid) {
                ...BuildFragment
            }
        }
        ${buildFragment}
    `;

    const buildResponse = await getClient().request(buildByUuidQuery, { 
        buildUuid
    });

    const build = buildResponse.build

    const queryParams = [
        [{ id: build.uuid, data: JSON.stringify(build) }]
    ];

    await query(`
        INSERT INTO "buildkite-build" (id, data)
        VALUES(:id::uuid, :data::jsonb)
        ON CONFLICT (id)
        DO UPDATE SET data = excluded.data
        RETURNING *;
        `,
        queryParams
    );
};

const indexPipelineBuilds = async pipelineSlug => {
    logger.info('indexPipelineBuilds: ', pipelineSlug);

    let builds = [];
    let buildsResponse = null;
    
    do {       
        buildsResponse = await getClient().request(buildsQuery, { 
            first: 50,
            after: lodash.get(buildsResponse, 'pipeline.builds.pageInfo.endCursor', null),
            pipelineSlug: `dale-salter/${pipelineSlug}` // TODO: Organisation from env
        });

        builds = [
            ...builds,
            ...buildsResponse.pipeline.builds.edges.map(({ node }) => node),
        ];
    } while (buildsResponse.pipeline.builds.pageInfo.hasNextPage);

    const queryParams = builds
        .map(node => [{ id: node.uuid, data: JSON.stringify(node) }]);

    const result = await query(`
        INSERT INTO "buildkite-build" (id, data)
        VALUES(:id::uuid, :data::jsonb)
        ON CONFLICT (id)
        DO UPDATE SET data = excluded.data
        RETURNING *;
        `,
        queryParams
    );
};

module.exports = { indexPipelineBuilds, indexBuild };