import { HttpContext } from '@adonisjs/core/build/standalone';

import RequestValidator from 'App/Decorators/RequestValidator';
import Book from 'App/Models/Book';
import BookCreateRequestValidator from 'App/Validators/Requests/BookCreateRequestValidator';
import BookIdRequiredRequestValidator from 'App/Validators/Requests/BookIdRequiredRequestValidator';
import GetBookRequestValidator from 'App/Validators/Requests/GetBookRequestValidator';

export default class BookController {
    @RequestValidator(GetBookRequestValidator)
    public async GetBooks({ request, response }: HttpContext): Promise<void> {
        try {
            const { id, ...body } = { ...request.all(), ...request.params() };

            if (id) {
                const book = await Book.find(id);

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
                        .orderBy(Book.columnName('updatedAt'), 'asc'),
                    Book.query()
                        .where(Book.columnName('isPermanentCollection'), '=', false)
                        .orderBy(Book.columnName('updatedAt'), 'asc')
                        .limit(3000)
                ]);

                return response.status(200).json(permanentData.concat(clientData));
            }

            const books = await Book.query()
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
                .if(
                    body.isPermanentCollection !== undefined &&
                    [true, false].includes(JSON.parse(body.isPermanentCollection)),
                    (query) => {
                        query.where(Book.queryColumn('isPermanentCollection'), JSON.parse(body.isPermanentCollection));
                    })
                .if(
                    body.checkedOut !== undefined &&
                    [true, false].includes(JSON.parse(body.checkedOut)),
                    (query) => {
                        query.where(Book.queryColumn('checkedOut'), JSON.parse(body.checkedOut));
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
