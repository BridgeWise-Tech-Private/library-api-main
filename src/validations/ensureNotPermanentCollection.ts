import errors from '#errors/index';

const { ForbiddenError } = errors;

/** Returns a book if it exists, otherwise throws 404 */
const ensureNotPermanentCollection = (book: BookType): void => {
  if (book.isPermanentCollection) {
    throw new ForbiddenError(
      `You cannot modify books in the permanent collection! Book with id '${book.id}' is in the permanent collection.`
    );
  }
};

export default ensureNotPermanentCollection;
