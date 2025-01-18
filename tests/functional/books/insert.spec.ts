import { test } from '@japa/runner';
import Book from '#models/book';
import env from '#start/env';

let insertedBookId: string;

test.group('Book C&D', () => {
  test('Insert Book', async ({ assert, client }) => {
    const inputData = {
      title: 'Foo',
      author: 'Bar',
      genre: 'fiction',
      yearPublished: 1500,
      checkedOut: false
    };

    const response = await client
      .post('/books')
      .json(inputData)
      .header('api-key', env.get('CLIENT_API_KEY'));

    response.assertStatus(201);
    assert.isTrue(response.hasBody());
    // response.assertAgainstApiSpec();
    // assert.isValidApiResponse(response);

    const body: Book = response.body();

    assert.isString(body.id);
    assert.notEmpty(body.id);
    insertedBookId = body.id;
    assert.strictEqual(body.title, inputData.title);
    assert.strictEqual(body.author, inputData.author);
    assert.strictEqual(body.genre, inputData.genre);
    assert.strictEqual(body.yearPublished, inputData.yearPublished);
    assert.isFalse(body.checkedOut);
    // assert.isFalse(body.isPermanentCollection);
    // assert.isBelow(new Date(body.createdAt.toString()).getTime(), new Date().getTime());
  });

  test('Delete Book', async ({ assert, client }) => {
    if (!insertedBookId) {
      assert.isTrue(false);
    }

    const response = await client
      .delete('/books/' + insertedBookId)
      .header('api-key', env.get('CLIENT_API_KEY'));

    response.assertStatus(204);
    // response.assertAgainstApiSpec();
    // assert.isValidApiResponse(response);
  });
});
