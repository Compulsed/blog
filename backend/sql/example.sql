SELECT
    (build.data->>'createdAt')::date as createdAt,
    pipeline.data->>'slug' as buildPipelineSlug,
    build.data->'createdBy'->>'name' as author,
    build.data->>'branch' as branch,
    COUNT(*) as totalBuilds,
    -- Messages
    -- COUNT(DISTINCT build.data->>'message') as distintCommitMessages,
    -- (COUNT(*) - COUNT(DISTINCT build.data->>'message')) as duplicatedCommitMessages,
    -- STRING_AGG(DISTINCT build.data->>'message', ',') as distinctMessages,
    
    -- Commits
    COUNT(DISTINCT build.data->>'commit') as distintBuildCommits,
	((COUNT(DISTINCT build.data->>'commit'))::float / COUNT(*)::float * 100)::integer as percentDistintBuilds,
    json_agg(DISTINCT build.data->>'commit') as distinctCommit
FROM
    "buildkite-build" as build
INNER JOIN
    "buildkite-pipeline" as pipeline
ON
    build.data->'pipeline'->>'slug' = pipeline.data->>'slug'
GROUP BY
    createdAt, buildPipelineSlug, author, branch
ORDER BY
    createdAt DESC;