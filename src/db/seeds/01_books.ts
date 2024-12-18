import knex from 'knex';
import books from '#db/fixtures/books';

export async function seed(knex: knex.Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex('books').del();

  await knex('books').insert(books);
}
