import env from '#start/env';
import Utils from '#utils/Utils';
import { defineConfig } from '@adonisjs/lucid';

const dbConfig = defineConfig({
  connection: 'postgres',
  connections: {
    postgres: {
      client: 'pg',
      connection: {
        host: env.get('DB_HOST'),
        port: env.get('DB_PORT'),
        user: env.get('DB_USER'),
        password: env.get('DB_PASSWORD'),
        database: env.get('DB_DATABASE'),
        // ssl: Utils.isProduction(),
        // ssl: { rejectUnauthorized: false }
        ssl: true
      },
      migrations: {
        naturalSort: true,
        paths: ['database/migrations'],
      },
    },
  },
});

export default dbConfig;
