const knex = require('../knex');

module.exports = async () => {
  console.log('Closing database connection...');
  await knex.destroy();
};