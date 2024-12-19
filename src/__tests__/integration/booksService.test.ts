import fixtures from '../fixtures/index';
import booksSeeds from '#db/fixtures/books';
import { delAllUserAddedBooks, updateBook } from '../utils/dbUtils';
import { describe, afterAll, it, expect } from 'vitest';
import fastifyApp from '#src/server';
import config from '#src/config';

// Test DB is dropped, migrated and seeded on each `npm run test`
// Therefore test run starts with a freshly seeded DB state, with books in src/db/fixtures/books

afterAll(async () => {
  console.log('Done with booksService test. \nDeleting user added books');
  await delAllUserAddedBooks();
});

describe('getBooks', () => {
  it('Gets all books', async () => {
    const response = await fastifyApp.inject({
      method: 'GET',
      url: '/books'
    });

    const books = response.json<BookType[]>();

    expect(books.every((b: BookType) => booksSeeds.some((s) => s.id === b.id)));
  });
  it('Filters by checked out: true', async () => {
    const url = '/books/' + booksSeeds[0].id;

    await updateBook(booksSeeds[0].id, { checkedOut: 1 });

    const response = await fastifyApp.inject().get(url).end();
    const book = response.json<BookType>();

    expect(book.checkedOut).toBe(true);

    await updateBook(booksSeeds[0].id, { checkedOut: 0 });
  });
  it('Filters by checked out: false', async () => {
    const response = await fastifyApp.inject().get('/books').query({
      checkedOut: 'false',
    }).end();
    const books = response.json<BookType[]>();

    expect(books.every((b: BookType) => !b.checkedOut)).toBe(true);
  });
  it('Filters by search keyword for artist or title', async () => {
    const search = 'borges';

    const response = await fastifyApp.inject().get('/books').query({ search }).end();
    const books = response.json<BookType[]>();

    expect(
      books.every((b: BookType) => {
        return (
          (b.title as string).match(new RegExp(search, 'i')) ||
          (b.author as string).match(new RegExp(search, 'i'))
        );
      })
    ).toBe(true);
  });
  it('Filters by genre', async () => {
    const genre = 'fiction';

    const response = await fastifyApp.inject().get('/books').query({ genre }).end();
    const books = response.json<BookType[]>();

    expect(books.every((b: BookType) => (b.genre as string).match(new RegExp(genre, 'i')))).toBe(true);
  });
  it('Filters by search, checkedOut and genre', async () => {
    const search = 'borges';
    const genre = 'fiction';
    const checkedOut = 'true';

    const response = await fastifyApp.inject().get('/books').query({ search, genre, checkedOut }).end();
    const books = response.json<BookType[]>();

    expect(
      books.every((b: BookType) => {
        return (
          ((b.title as string).match(new RegExp(search, 'i')) ||
            (b.author as string).match(new RegExp(search, 'i')))
        );
      })
    ).toBe(true);
    expect(books.every((b: BookType) => b.genre === genre)).toBe(true);
    expect(books.every((b: BookType) => b.checkedOut === true)).toBe(true);
  });
});

describe('createBook', () => {
  it('Adds a book and returns the new book', async () => {
    const input = fixtures.inputs.createBookOne;
    // const newBook = await booksService.createBook(input);

    const response = await fastifyApp
      .inject()
      .post('/books')
      .body(input)
      .headers({ [config.demoApiKeyKey]: config.demoApiKeyVal })
      .end();
    const newBook = await response.json<BookType>();

    expect(typeof newBook.id).toBe('string');
    expect(newBook.title).toMatch(input.title);
    expect(newBook.author).toMatch(input.author);
    expect(newBook.genre).toMatch(input.genre);
    expect(newBook.yearPublished).toEqual(input.yearPublished);
    expect(newBook.checkedOut).toBe(false);
    expect(newBook.isPermanentCollection).toBe(false);
    expect(new Date(newBook.createdAt).getTime()).toBeLessThan(
      new Date().getTime()
    );
  });
});
