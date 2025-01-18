import Book from "#models/book";
import { ServiceResponseType } from "#types/Core";
import Utils from "#utils/Utils";
import { DateTime } from "luxon";


class BookService {
    public async getBooks({ id, body }: { id?: number, body?: Partial<Book> }): Promise<ServiceResponseType> {
        try {
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
                    .where({ id }).first();

                if (!book) {
                    return {
                        status: 404,
                        data: { message: `Book with id '${id}' not found` },
                    };
                }

                return {
                    status: 200,
                    data: book,
                };
            }
            else if (
                !body ||
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

                return {
                    status: 200,
                    data: permanentData.concat(clientData),
                };
            }

            const books = await bookSelectQuery
                .orderBy(Book.columnName('updatedAt'), 'desc')
                .limit(3000)
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
                    query.where(Book.queryColumn('yearPublished'), body.yearPublished as number);
                })
                .if([true, false].includes(body.isPermanentCollection as boolean), (query) => {
                    query.where(Book.queryColumn('isPermanentCollection'), body.isPermanentCollection as boolean);
                })
                .if([true, false].includes(body.checkedOut as boolean), (query) => {
                    query.where(Book.queryColumn('checkedOut'), body.checkedOut as boolean);
                });

            return {
                status: 200,
                data: books,
            };
        } catch (err) {
            console.log(JSON.stringify(err));
            return {
                status: 500,
                data: { err },
            };
        }
    }

    public async createNewBook(body: Partial<Book>): Promise<ServiceResponseType> {
        try {
            body = await Book.validateForCreate(body);

            body = Object.assign(body, {
                id: Utils.generateUuid(),
                createdAt: DateTime.now().toSQL(),
                updatedAt: DateTime.now().toSQL()
            });

            // This step is needed to get all the fields that are not sent in the request body
            // Ideally we would use Book.validateCreate(body)

            const [createdBook] = await Book.query().knexQuery.insert(Utils.toSnakeCase(body)).returning([
                Book.queryColumn('id'),
                Book.queryColumn('title'),
                Book.queryColumn('author'),
                Book.queryColumn('genre'),
                Book.queryColumn('yearPublished'),
                Book.queryColumn('checkedOut'),
                Book.queryColumn('isPermanentCollection'),
                Book.queryColumn('createdAt')
            ]);

            createdBook.created_at = createdBook.created_at.toISOString();

            return {
                status: 201,
                data: Utils.toCamelCase(createdBook)
            };
        } catch (err) {
            console.log(JSON.stringify(err));
            return {
                status: 500,
                data: { err },
            };
        }
    }

    public async updateBook({ id, body }: { id: number, body: Partial<Book> }): Promise<ServiceResponseType> {
        try {
            const book = await Book.find(id);

            if (!book) {
                return {
                    status: 404,
                    data: { message: `Book with id '${id}' not found` }
                };
            }

            if (book.isPermanentCollection) {
                return {
                    status: 403,
                    data: {
                        "message": `You cannot modify books in the permanent collection! Book with id '${id
                            }' is in the permanent collection.`
                    },
                };
            }

            // This step is needed to get all the fields that are not sent in the request body
            // Ideally we would use Book.validateUpdate(body)
            const bookData = Object.assign(await Book.validateForUpdate(body), { updatedAt: DateTime.now() });

            const [updatedBook] = await Book.query().update(bookData).returning([
                Book.queryColumn('id'),
                Book.queryColumn('title'),
                Book.queryColumn('author'),
                Book.queryColumn('genre'),
                Book.queryColumn('yearPublished'),
                Book.queryColumn('checkedOut'),
                Book.queryColumn('isPermanentCollection'),
                Book.queryColumn('createdAt')
            ]);

            updatedBook.created_at = updatedBook.created_at.toISOString();


            return {
                status: 200,
                data: Utils.toCamelCase(updatedBook),
            };
        } catch (err) {
            console.log(JSON.stringify(err));
            return {
                status: 500,
                data: { err },
            };
        }
    }

    public async deleteBook(id: number): Promise<ServiceResponseType> {
        try {
            const book = await Book.find(id);

            if (!book) {
                return {
                    status: 404,
                    data: { message: `Book with id '${id}' not found` },
                };
            }

            if (book.isPermanentCollection) {
                return {
                    status: 403,
                    data: {
                        "message": `You cannot modify books in the permanent collection! Book with id '${id
                            }' is in the permanent collection.`
                    },
                };
            }

            await Book.query().where({ id }).delete();

            return {
                status: 204,
                data: { message: `Book with id "${id}" is deleted successfully.` },
            };
        } catch (err) {
            console.log(JSON.stringify(err));
            return {
                status: 500,
                data: { err },
            };
        }
    }
}

export default new BookService();