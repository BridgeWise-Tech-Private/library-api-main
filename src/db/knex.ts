import knexConfigs from './knexfile';
import Knex from 'knex';

const env = process.env.NODE_ENV || 'development';

const config = knexConfigs[env] as string;

const knex = Knex(config);

export default knex;
