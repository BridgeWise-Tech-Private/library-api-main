import booksData from '#db/fixtures/books';
import books from '#models/books';

export async function seed(): Promise<void> {
  // Deletes ALL existing entries
  await books.query.delete();

  await books.query.insert(booksData);
}
