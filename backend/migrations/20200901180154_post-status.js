exports.up = async function(knex) {
    await knex.schema.alterTable('post', table => {
        table
            .string('publishStatus');
    });
};
  
exports.down = async function(knex) {
    await knex.schema.alterTable('post', table => {
        table
            .dropColumn ('publishStatus');
    });
};