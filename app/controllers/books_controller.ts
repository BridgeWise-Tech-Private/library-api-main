import { type HttpContext } from '@adonisjs/core/http';

import Book from "#models/book";
import RequestValidator from '#decorators/RequestValidator';
import BookCreateRequestValidator from '#validators/request_validators/book_create_request_validator';
import GetBookRequestValidator from '#validators/request_validators/get_book_request_validator';
import BookIdRequiredRequestValidator from '#validators/request_validators/book_id_required_request_validator';

export default class BooksController {
    @RequestValidator(GetBookRequestValidator)
    public async GetBooks({ request, response }: HttpContext): Promise<void> {
        const { id, ...body } = { ...request.all(), ...request.params() };

        if (id) {
            const book = await Book.find(id);

            if (!book) {
                return response.notFound();
            }

            return response.status(200).json(book);
        }

        const books = await Book.query()
            .if(body.title, (query) => {
                query.whereILike(Book.queryColumn('title'), `%${body.title}%`);
            })
            .if(body.author, (query) => {
                query.whereILike(Book.queryColumn('author'), `%${body.author}%`);
            })
            .if(body.genre, (query) => {
                query.whereILike(Book.queryColumn('genre'), `%${body.genre}%`);
            })
            .if(body.yearPublished, (query) => {
                query.where(Book.queryColumn('yearPublished'), body.yearPublished);
            })
            .if(![undefined, null].includes(body.isPermanentCollection), (query) => {
                query.where(Book.queryColumn('isPermanentCollection'), body.isPermanentCollection);
            })
            .if(![undefined, null].includes(body.checkedOut), (query) => {
                query.where(Book.queryColumn('checkedOut'), body.checkedOut);
            });

        response.status(200).json(books);
    }

    @RequestValidator(BookCreateRequestValidator)
    public async CreateNewBook({ request, response }: HttpContext): Promise<void> {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const body = request.all();

        const createdBook = await Book.validateCreate(body);

        response.created(createdBook);
    }

    @RequestValidator(GetBookRequestValidator)
    @RequestValidator(BookIdRequiredRequestValidator)
    public async UpdateBook({ request, response }: HttpContext): Promise<void> {
        const { id, ...body } = { ...request.all(), ...request.params() };

        let book = await Book.find(id);

        if (!book) {
            return response.notFound();
        }

        if (book.isPermanentCollection) {
            return response.forbidden();
        }

        book = await Book.validateUpdate(id, body);

        response.status(200).json(book);
    }

    @RequestValidator(BookIdRequiredRequestValidator)
    public async DeleteBook({ request, response }: HttpContext): Promise<void> {
        const { id } = request.params();

        const book = await Book.find(id);

        if (!book) {
            return response.notFound();
        }

        if (book.isPermanentCollection) {
            return response.forbidden();
        }

        await Book.deleteBy({ id });

        response.status(204).json(book);
    }
}