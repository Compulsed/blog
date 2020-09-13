exports.up = async function(knex) {
    return knex.raw(`
        ALTER TABLE "post"
        ADD "availableWithLink" BOOLEAN;

        UPDATE "post" 
        SET "availableWithLink" = false;
    `)
};
  
exports.down = async function(knex) {
    return knex.raw(`
        ALTER TABLE "post"
        DROP "availableWithLink";
    `);
};