
exports.up = async function(knex) {
  console.log('Init users');
  await knex.schema.createTable("users", table => {
      table
        .increments("user_id")
        .unsigned()
        .primary();

      table
        .string("email")
        .unique()
        .notNullable();

      table
        .string("first_name")
        .notNullable();

      table
        .string("last_name")
        .notNullable();
  });
};

exports.down = async function(knex) {
    await knex.schema.dropTable("users");
};
