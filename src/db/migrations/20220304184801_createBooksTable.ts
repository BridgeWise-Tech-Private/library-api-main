import * as Knex from 'knex';

export async function up(knex: Knex.Knex): Promise<void> {
  // Install the uuid-ossp extension
  await knex.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";');

  // Create the books table
  return knex.schema.createTable('books', (table: Knex.Knex.TableBuilder) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.string('title', 255).notNullable();
    table.string('author', 255).notNullable();
    table.string('genre', 255).notNullable();
    table.integer('yearPublished').notNullable();
    table.boolean('checkedOut').notNullable().defaultTo(false);
    table.boolean('isPermanentCollection').notNullable().defaultTo(false);
    table.timestamp('createdAt').defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex.Knex): Promise<void> {
  // Drop the books table
  return knex.schema.dropTable('books');
}
