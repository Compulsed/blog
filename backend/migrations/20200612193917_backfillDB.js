const shell = require('shelljs');

exports.up = function(knex) {
  console.log('Backfilling database started');
  shell.exec(`yarn sls invoke local -f pipelines -s "$STAGE" --data "{}"`);
  console.log('Backfilling database finished');
};

exports.down = function(knex) {
  
};
