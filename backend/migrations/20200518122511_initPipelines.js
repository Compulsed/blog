exports.up = async function(knex) {
    await knex.schema.createTable('buildkite-pipeline', table => {
        table
          .uuid('id')
          .primary();
        
        table
          .jsonb('data');
    });
};

exports.down = async function(knex) {
    await knex.schema.dropTable('buildkite-pipeline');
};