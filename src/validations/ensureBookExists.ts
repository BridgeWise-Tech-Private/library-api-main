import errors from '#errors/index';
import books from '#models/books';

const { NotFoundError } = errors;

/** Returns a book if it exists, otherwise throws 404 */
const ensureBookExists = async (
  { id }: IdParams,
): Promise<BookType> => {
  const book: BookType = await books.findOneById(id);
  if (!book) {
    throw new NotFoundError(`Book with id '${id}' not found`);
  }
  return book;
};

export default ensureBookExists;
