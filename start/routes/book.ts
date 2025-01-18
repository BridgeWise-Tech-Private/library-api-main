import router from '@adonisjs/core/services/router';

import BooksController from '#controllers/books_controller';
import Utils from '#utils/Utils';
import { middleware } from '#start/kernel';

router
    .group(() => {
        router.get('/', [BooksController, 'GetBooks']).as('get.all');
        router
            .get('/:id', [BooksController, 'GetBooks'])
            .as('get.id')
            .where('id', Utils.ALPHANUMERIC_WITH_OPTIONAL_HYPHEN_UNDERSCORE_IN_BETWEEN);

        router.group(() => {
            router.post('/', [BooksController, 'CreateNewBook']).as('book.create');
            router.group(() => {
                router.patch('/', [BooksController, 'UpdateBook']).as('book.update');
                router.delete('/', [BooksController, 'DeleteBook']).as('book.delete');
            })
                .prefix('/:id')
                .where('id', Utils.ALPHANUMERIC_WITH_OPTIONAL_HYPHEN_UNDERSCORE_IN_BETWEEN);
        })
            .middleware(middleware.apiKeyRequired());
    })
    .prefix('books')
    .as('book');
