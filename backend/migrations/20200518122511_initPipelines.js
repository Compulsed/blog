exports.up = async function(knex) {
    console.log('Start: Init pipelines');
    await knex.schema.createTable('buildkite-pipeline', table => {
        console.log('Process: Init Pipelines Create Table');

        table
          .uuid('id')
          .primary();
        
        table
          .jsonb('data');
    });

    console.log('End: Init pipelines');
};

exports.down = async function(knex) {
    await knex.schema.dropTable('buildkite-pipeline');
};