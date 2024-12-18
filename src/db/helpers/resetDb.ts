import knex from '#db/knex';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables from .env file
dotenv.config({ path: path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '.env') });

/** Used when resetting database */
const resetDb = async (): Promise<void> => {
  try {
    const { current_database: currentDb } = (
      await knex.raw('SELECT current_database()')
    ).rows[0];
    console.log(
      `Dropping data in database '${currentDb}' and clearing migration history...`
    );

    // Install the uuid-ossp extension
    await knex.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";');

    // delete migrations history
    await knex.schema.dropTableIfExists('knex_migrations');
    await knex.schema.dropTableIfExists('knex_migrations_lock');

    // drop books table
    await knex.schema.dropTableIfExists('books');

    console.log('Database reset successful');
  } catch (error) {
    console.error('Error resetting database:', error);
    process.exit(1);
  } finally {
    await knex.destroy();
  }
};

resetDb();
