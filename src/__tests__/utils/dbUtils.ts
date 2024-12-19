import books from '#models/books';

// User added books have isPermanentCollection: false property
export const delAllUserAddedBooks = async (): Promise<void> => {
  await books.query.delete().where({ isPermanentCollection: false });
};

export const updateBook = async (
  bookId: string,
  inputs: { [key: string]: string | number }
): Promise<void> => {
  await books.query.where({ id: bookId }).update(inputs, '*');
};
