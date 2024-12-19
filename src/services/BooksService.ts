import BooksDal from '#services/dals/BooksDal';

import ensureBookExists from '#validations/ensureBookExists';
import ensureNotPermanentCollection from '#validations/ensureNotPermanentCollection';
import { filterObj, filterObjStringsForProfanity } from '#utils/index';

class BooksService {
  booksDal: BooksDal;

  constructor(booksDal: BooksDal) {
    this.booksDal = booksDal;
  }

  getBook = async ({ id }: IdParams): Promise<BookType> => {
    const book = await ensureBookExists({ id });
    return book;
  };

  getBooks = async (params: GetBooksParams = {}): Promise<BookType[]> => {
    return this.booksDal.getBooks(params);
  };

  createBook = async (input: CreateBookInput): Promise<BookType> => {
    const filteredInput = filterObj(input, [
      'title',
      'author',
      'genre',
      'yearPublished'
    ]);

    return this.booksDal.createBook(filterObjStringsForProfanity(filteredInput));
  };

  updateBook = async (
    { id }: IdParams,
    input: UpdateBookInput
  ): Promise<BookType> => {
    const book = await ensureBookExists({ id });
    ensureNotPermanentCollection(book);
    const filteredInput = filterObj(input, [
      'title',
      'author',
      'genre',
      'yearPublished',
      'checkedOut'
    ]);
    return this.booksDal.updateBook(
      { id },
      filterObjStringsForProfanity(filteredInput)
    );
  };

  deleteBook = async ({ id }: IdParams): Promise<void> => {
    const book = await ensureBookExists({ id });
    ensureNotPermanentCollection(book);

    return this.booksDal.deleteBook({ id });
  };
}

export default BooksService;
