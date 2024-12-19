import BooksService from '#services/BooksService';
import BooksDal from '#services/dals/BooksDal';

// Build DALS
const booksDal = new BooksDal();

const dals = {
  booksDal
};

// Build Services
const booksService = new BooksService(booksDal);

const services = {
  booksService
};
// Export services

const context = { dals, services };

export default context;
