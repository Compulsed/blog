exports.up = async function(knex) {
    console.log('Init post');
    await knex.schema.alterTable('post', table => {
        table
          .dropColumn ('createdAt');
        
        table
          .dropColumn('updatedAt');    
    });
  };
  
  exports.down = async function(knex) {

  };