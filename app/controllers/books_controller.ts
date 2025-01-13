import { type HttpContext } from '@adonisjs/core/http';

import Book from "#models/book";
import RequestValidator from '#decorators/RequestValidator';
import BookCreateRequestValidator from '#validators/request_validators/book_create_request_validator';
import GetBookRequestValidator from '#validators/request_validators/get_book_request_validator';
import BookIdRequiredRequestValidator from '#validators/request_validators/book_id_required_request_validator';

export default class BooksController {
    @RequestValidator(GetBookRequestValidator)
    public async GetBooks({ request, response }: HttpContext): Promise<void> {
        try {
            const { id, ...body } = { ...request.all(), ...request.params() };

            const bookSelectQuery = Book
                .query()
                .select([
                    Book.queryColumn('id'),
                    Book.queryColumn('title'),
                    Book.queryColumn('author'),
                    Book.queryColumn('genre'),
                    Book.queryColumn('yearPublished'),
                    Book.queryColumn('checkedOut'),
                    Book.queryColumn('isPermanentCollection'),
                    Book.queryColumn('createdAt')
                ]);

            if (id) {
                const book = await bookSelectQuery
                    .where({ id });

                if (!book) {
                    return response.status(404).json({ message: `Book with id '${id}' not found` });
                }

                return response.status(200).json(book);
            }
            else if (
                !Object.keys(body).some(key =>
                    ['title', 'author', 'genre', 'yearPublished', 'isPermanentCollection', 'checkedOut']
                        .includes(key)
                )) {
                const [permanentData, clientData] = await Promise.all([
                    Book.query()
                        .where(Book.columnName('isPermanentCollection'), '=', true)
                        .select([
                            Book.queryColumn('id'),
                            Book.queryColumn('title'),
                            Book.queryColumn('author'),
                            Book.queryColumn('genre'),
                            Book.queryColumn('yearPublished'),
                            Book.queryColumn('checkedOut'),
                            Book.queryColumn('isPermanentCollection'),
                            Book.queryColumn('createdAt')
                        ])
                        .orderBy(Book.columnName('updatedAt'), 'asc'),
                    Book.query()
                        .where(Book.columnName('isPermanentCollection'), '=', false)
                        .select([
                            Book.queryColumn('id'),
                            Book.queryColumn('title'),
                            Book.queryColumn('author'),
                            Book.queryColumn('genre'),
                            Book.queryColumn('yearPublished'),
                            Book.queryColumn('checkedOut'),
                            Book.queryColumn('isPermanentCollection'),
                            Book.queryColumn('createdAt')
                        ])
                        .orderBy(Book.columnName('updatedAt'), 'asc')
                        .limit(3000)
                ]);

                return response.status(200).json(permanentData.concat(clientData));
            }

            const books = await bookSelectQuery
                .orderBy(Book.columnName('updatedAt'), 'asc')
                .limit(5000)
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
                .if([true, false].includes(body.isPermanentCollection), (query) => {
                    query.where(Book.queryColumn('isPermanentCollection'), body.isPermanentCollection);
                })
                .if([true, false].includes(body.checkedOut), (query) => {
                    query.where(Book.queryColumn('checkedOut'), body.checkedOut);
                });

            response.status(200).json(books);
        } catch (err) {
            console.log(JSON.stringify(err));
            response.status(500).json({ err });
        }
    }

    @RequestValidator(BookCreateRequestValidator)
    public async CreateNewBook({ request, response }: HttpContext): Promise<void> {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        try {
            const body = request.all();

            const createdBook = await Book.validateCreate(body);

            response.created(createdBook);
        } catch (err) {
            console.log(JSON.stringify(err));
            response.status(500).json({ err });
        }
    }

    @RequestValidator(GetBookRequestValidator)
    @RequestValidator(BookIdRequiredRequestValidator)
    public async UpdateBook({ request, response }: HttpContext): Promise<void> {
        try {
            const { id, ...body } = { ...request.all(), ...request.params() };

            let book = await Book.find(id);

            if (!book) {
                return response.status(404).json({ message: `Book with id '${id}' not found` });
            }

            if (book.isPermanentCollection) {
                return response.status(403).json({
                    "message": `You cannot modify books in the permanent collection! Book with id '${id
                        }' is in the permanent collection.`
                });
            }

            book = await Book.validateUpdate(id, body);

            response.status(200).json(book);
        } catch (err) {
            console.log(JSON.stringify(err));
            response.status(500).json({ err });
        }
    }

    @RequestValidator(BookIdRequiredRequestValidator)
    public async DeleteBook({ request, response }: HttpContext): Promise<void> {
        try {
            const { id } = request.params();

            const book = await Book.find(id);

            if (!book) {
                return response.status(404).json({ message: `Book with id '${id}' not found` });
            }

            if (book.isPermanentCollection) {
                return response.status(403).json({
                    "message": `You cannot modify books in the permanent collection! Book with id '${id
                        }' is in the permanent collection.`
                });
            }

            await Book.query().where({ id }).delete();

            response.status(204).json(book);
        } catch (err) {
            console.log(JSON.stringify(err));
            response.status(500).json({ err });
        }
    }
}