exports.up = async function(knex) {
    console.log('Init post');
    await knex.schema.alterTable('post', table => {
        table
          .timestamp('createdAt');
        
        table
          .timestamp('updatedAt');    
    });
  };
  
  exports.down = async function(knex) {

  };