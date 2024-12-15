import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

import config from '../config';

const knexConfig: { [key: string]: unknown } = {
  test: {
    client: 'postgresql',
    migrations: {
      directory: './migrations'
    },
    seeds: {
      directory: './seeds'
    },
    connection: process.env.NEON_DB_CONNECTION_STRING || 'postgres://localhost:5432/library_api_test'
  },
  development: {
    client: 'postgresql',
    migrations: {
      directory: './migrations'
    },
    seeds: {
      directory: './seeds'
    },
    connection: process.env.NEON_DB_CONNECTION_STRING || 'postgres://localhost:5432/library_api_dev'
  },
  production: {
    client: 'postgresql',
    connection: config.prodDbConnectionUrl,
    pool: {
      min: 0,
      max: 10
    }
  },
  migrations: {
    directory: './migrations'
  },
  seeds: {
    directory: './seeds'
  }
};

export default knexConfig;
