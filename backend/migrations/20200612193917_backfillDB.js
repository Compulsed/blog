const shell = require('shelljs');

exports.up = async function(knex) {
  console.log('Backfill start');

  await knex.raw(`
    insert into "buildkite-pipeline"
    ("data", "id")
    values (?, ?)
    ON CONFLICT (id)
    DO UPDATE SET data = excluded.data
    RETURNING *`, [
        JSON.stringify({}),
        '38a38813-abf8-431d-80b8-e4627c0a9600'
    ]
  );
};

exports.down = async function(knex) {
  
};
