const knex = require('../../src/db/knex');

module.exports = async () => {
  console.log('Closing database connection...');
  await knex.destroy();
};
