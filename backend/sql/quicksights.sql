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
inner join engineer on
	data->'createdBy'->>'name' = engineer.engineerName
inner join "engineer-team" on
	engineer.engineerName = "engineer-team".engineerName 
		AND (build.data->>'createdAt')::DATE > "engineer-team".startDate
		AND ("engineer-team".endDate IS NULL OR (build.data->>'createdAt')::DATE < "engineer-team".endDate)
inner join team on
	team.teamName = "engineer-team".teamName;

select * from "buildkite-build-view";

DROP VIEW "buildkite-build-view";

CREATE TABLE "engineer" (
    engineerName TEXT PRIMARY KEY NOT NULL
);

CREATE TABLE "team" (
    teamName TEXT PRIMARY KEY NOT NULL
);

CREATE TABLE "engineer-team" (
    engineerName TEXT REFERENCES "engineer"(engineerName),
    teamName TEXT REFERENCES "team"(teamName),
    startDate DATE,
    endDate DATE
);

INSERT INTO engineer (engineerName) VALUES('Dale Salter');

INSERT INTO team (teamName) VALUES('Student');
INSERT INTO team (teamName) VALUES('Organisation');

INSERT INTO "engineer-team"
	(engineerName, teamName, startDate, endDate)
VALUES
	('Dale Salter', 'Student', '2016-01-01', '2020-05-15');

INSERT INTO "engineer-team"
	(engineerName, teamName, startDate)
VALUES
	('Dale Salter', 'Organisation', '2020-05-16');
