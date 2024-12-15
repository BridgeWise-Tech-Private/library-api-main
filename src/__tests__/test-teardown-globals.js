const knex = require('../db/knex').default;

module.exports = async () => {
  console.log('Closing database connection...');
  await knex.destroy();
};
