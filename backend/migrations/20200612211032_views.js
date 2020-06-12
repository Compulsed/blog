exports.up = async function(knex) {
  await knex.raw(`
    CREATE OR REPLACE VIEW "buildkite-build-view" AS  select
      build.id,
      build.data->>'url' as url,
      build.data->>'state' as status,
      build.data->>'branch' as branch,
      build.data->>'commit' as commit,
      build.data->>'number' as number,
      build.data->>'message' as message,
      build.data->'pipeline'->>'slug' as slug,
      build.data->'createdBy'->>'name' as name,
      (build.data->>'finishedAt')::DATE as finishedAt,
      (build.data->>'createdAt')::DATE as createdAt,
      build.data->>'pullRequest' as pullRequest,
      team.teamName as teamName
    from
    "buildkite-build" build
    left join engineer on
    data->'createdBy'->>'name' = engineer.engineerName
    left join "engineer-team" on
    engineer.engineerName = "engineer-team".engineerName 
      AND (build.data->>'createdAt')::DATE > "engineer-team".startDate
      AND ("engineer-team".endDate IS NULL OR (build.data->>'createdAt')::DATE < "engineer-team".endDate)
    left join team on
    team.teamName = "engineer-team".teamName;
  `);
};

exports.down = function(knex) {
  
};
