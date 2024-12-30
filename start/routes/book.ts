import router from '@adonisjs/core/services/router';

import BooksController from '#controllers/books_controller';
import Utils from '#utils/Utils';
import { middleware } from '#start/kernel';

router
    .group(() => {
        router.get('/', [BooksController, 'GetBooks']).as('get.all');
        router.get('/:id', [BooksController, 'GetBooks']).as('get.id').where('id', Utils.ALPHANUMERIC);

        router.group(() => {
            router.post('/', [BooksController, 'CreateNewBook']).as('book.create');
            router.patch('/:id', [BooksController, 'UpdateBook']).as('book.update');
            router.delete('/:id', [BooksController, 'DeleteBook']).as('book.delete');
        })
            .middleware(middleware.apiKeyRequired());
    })
    .prefix('books')
    .as('book');
