/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route';

import Utils from 'App/Utils/Utils';

Route
    .group(() => {
        Route.get('/', 'BookController.GetBooks').as('get.all');
        Route
            .get('/:id', 'BookController.GetBooks')
            .as('get.id')
            .where('id', Utils.ALPHANUMERIC_WITH_OPTIONAL_HYPHEN_IN_BETWEEN);

        Route.group(() => {
            Route.post('/', 'BookController.CreateNewBook').as('book.create');
            Route.group(() => {
                Route.patch('/', 'BookController.UpdateBook').as('book.update');
                Route.delete('/', 'BookController.DeleteBook').as('book.delete');
            })
                .prefix('/:id')
                .where('id', Utils.ALPHANUMERIC_WITH_OPTIONAL_HYPHEN_IN_BETWEEN);
        })
            .middleware(['apiKeyRequired']);
    })
    .prefix('books')
    .as('book');
