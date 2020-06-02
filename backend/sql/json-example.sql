CREATE TABLE IF NOT EXISTS cards (
  id integer NOT NULL,
  board_id integer NOT NULL,
  data jsonb
);

do $$
    begin
        for r in 1..500 loop
            INSERT INTO cards VALUES (1, 1, '{"name": "Paint house", "tags": ["Improvements", "Office"], "finished": true}');
            INSERT INTO cards VALUES (2, 1, '{"name": "Wash dishes", "tags": ["Clean", "Kitchen"], "finished": false}');
            INSERT INTO cards VALUES (3, 1, '{"name": "Cook lunch", "tags": ["Cook", "Kitchen", "Tacos"], "ingredients": ["Tortillas", "Guacamole"], "finished": false}');
            INSERT INTO cards VALUES (4, 1, '{"name": "Vacuum", "tags": ["Clean", "Bedroom", "Office"], "finished": false}');
            INSERT INTO cards VALUES (5, 1, '{"name": "Hang paintings", "tags": ["Improvements", "Office"], "finished": false}');
        end loop;
    end;
$$;

SELECT data->>'name' AS name FROM cards;

SELECT * FROM cards WHERE data->>'finished' = 'true';

SELECT count(*) FROM cards WHERE data ? 'ingredients';

SELECT
  jsonb_array_elements_text(data->'tags') as tag
FROM cards
WHERE id = 1;

EXPLAIN ANALYZE SELECT count(*) FROM cards WHERE data->>'finished' = 'true';

CREATE INDEX idxfinished ON cards ((data->>'finished'));

EXPLAIN ANALYZE SELECT count(*) FROM cards
WHERE
  data->'tags' ? 'Clean'
  AND data->'tags' ? 'Kitchen';

CREATE INDEX idxgintags ON cards USING gin ((data->'tags'));

CREATE INDEX idxgindata ON cards USING gin (data);

-- https://www.postgresql.org/docs/9.4/functions-json.html
EXPLAIN ANALYZE SELECT count(*) FROM cards
WHERE
  data @> '{"tags": ["Clean", "Kitchen"]}';

insert into "buildkite-pipeline" ("data", "uuid") values ('{\"id\":\"UGlwZWxpbmUtLS0wMGI2ZjRkYi0wNjFjLTRiNTQtYmE0ZC0wZDA3NjU0YWI5MGI=\",\"uuid\":\"00b6f4db-061c-4b54-ba4d-0d07654ab90b\",\"url\":\"https://buildkite.com/dale-salter/eng-stats-merge\",\"name\":\"eng-stats-merge\"}', '00b6f4db-061c-4b54-ba4d-0d07654ab90b')


select "uuid", "data" from "buildkite-pipeline" where "data"->>'name'='eng-stats-merge'
