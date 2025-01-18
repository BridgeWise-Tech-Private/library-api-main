import { test } from '@japa/runner';
import BooksData from '#database/seed_data/book.json' assert { type: 'json' };
import Book from '#models/book';

test.group('Users list', () => {
  test('get a list of books', async ({ assert, client }) => {
    const response = await client.get('/books');

    response.assertStatus(200);
    assert.isTrue(response.hasBody());
    response.assertAgainstApiSpec();
    // assert.isValidApiResponse(response);

    const body: Book[] = response.body();
    assert.isTrue(BooksData.every((b) => body.some((s) => s.id === b.id)));
  });
});
