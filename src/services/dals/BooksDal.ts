import Book from '#models/books';


class BooksDal {
  getBooks = async (params: GetBooksParams): Promise<BookType[]> => {
    const query = Book.query.select('*').whereNotNull('id').orderBy('createdAt', 'desc');

    if (params.genre) {
      query.andWhereILike(Book.columnName('genre'), params.genre?.toLocaleLowerCase());
    }
    if (typeof params.checkedOut === 'boolean') {
      query.andWhere((andQuery) => {
        andQuery.andWhere(Book.columnName('checkedOut'), Boolean(params.checkedOut));
      });
    }
    if (params.search) {
      query.andWhere((andQuery) => {
        andQuery
          .whereILike(Book.columnName('title'), params.search?.toLocaleLowerCase())
          .orWhereILike(Book.columnName('author'), params.search?.toLocaleLowerCase());
      });
    }

    return query;
  };

  createBook = async (input: CreateBookInput): Promise<BookType> => {
    return Book.insert(input); // return one
  };

  updateBook = async ({ id }: IdParams, input: UpdateBookInput): Promise<BookType> => {
    return Book.query
      .where({ id })
      .update(input)
      .returning('*')
      .then((r: BookType[]) => r[0]); // return one
  };

  getBook = async (params: IdParams): Promise<BookType> => {
    return Book.query.select('*').where(params).first(); // return one
  };

  deleteBook = async (params: IdParams): Promise<void> => {
    return Book.query
      .where(params)
      .delete();
  };
}

export default BooksDal;
