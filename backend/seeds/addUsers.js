const faker = require('faker');
const _ = require('lodash');

const createFakeUser = () => ({
  email: faker.internet.email(),
  first_name: faker.name.firstName(),
  last_name: faker.name.lastName(),
});

exports.seed = async function(knex) {
  const fakeUsers = _.times(100)
    .map(() => createFakeUser());

  await knex('users')
    .insert(fakeUsers)
};
