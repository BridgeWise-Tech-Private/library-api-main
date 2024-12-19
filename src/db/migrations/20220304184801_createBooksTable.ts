import books from '#models/books';
import * as Knex from 'knex';

export async function up(knex: Knex.Knex): Promise<void> {
  // Install the uuid-ossp extension
  await knex.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";');

  // Create the books table
  return knex.schema.createTable(books.tableName, (table: Knex.Knex.TableBuilder) => {
    table.uuid(books.columnName('id')).primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.string(books.columnName('title'), 255).notNullable();
    table.string(books.columnName('author'), 255).notNullable();
    table.string(books.columnName('genre'), 255).notNullable();
    table.integer(books.columnName('yearPublished')).notNullable();
    table.boolean(books.columnName('checkedOut')).notNullable().defaultTo(false);
    table.boolean(books.columnName('isPermanentCollection')).notNullable().defaultTo(false);
    table.timestamp(books.columnName('createdAt')).defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex.Knex): Promise<void> {
  // Drop the books table
  return knex.schema.dropTable(books.tableName);
}
