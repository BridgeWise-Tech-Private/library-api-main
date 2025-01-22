import { type HttpContext } from '@adonisjs/core/http';

import RequestValidator from '#decorators/RequestValidator';
import BookCreateRequestValidator from '#validators/request_validators/book_create_request_validator';
import GetBookRequestValidator from '#validators/request_validators/get_book_request_validator';
import BookIdRequiredRequestValidator from '#validators/request_validators/book_id_required_request_validator';
import book_service from '#services/book_service';

export default class BooksController {
    @RequestValidator(GetBookRequestValidator)
    public async GetBooks({ request, response }: HttpContext): Promise<void> {
        try {
            const { id, ...body } = { ...request.all(), ...request.params() };

            const { status, data } = await book_service.getBooks({ id, body });

            return response.status(status).json(data);
        } catch (err) {
            console.log(JSON.stringify(err));
            response.status(500).json({ err });
        }
    }

    @RequestValidator(BookCreateRequestValidator)
    public async CreateNewBook({ request, response }: HttpContext): Promise<void> {
         
        try {
            const { status, data } = await book_service.createNewBook(request.all());

            return response.status(status).json(data);
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

            const { status, data } = await book_service.updateBook({ id, body });

            response.status(status).json(data);
        } catch (err) {
            console.log(JSON.stringify(err));
            response.status(500).json({ err });
        }
    }

    @RequestValidator(BookIdRequiredRequestValidator)
    public async DeleteBook({ request, response }: HttpContext): Promise<void> {
        try {
            const { id } = request.params();

            const { status, data } = await book_service.deleteBook(id);

            response.status(status).json(data);
        } catch (err) {
            console.log(JSON.stringify(err));
            response.status(500).json({ err });
        }
    }
}