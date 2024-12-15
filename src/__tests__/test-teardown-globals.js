import knex from '../db/knex';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export default async () => {
  console.log('Closing database connection...');
  await knex.destroy();
};
