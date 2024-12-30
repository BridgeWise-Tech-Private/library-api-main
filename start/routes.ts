/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router';
import { NextFn } from '@adonisjs/core/types/http';
import { HttpContext } from '@adonisjs/core/http';

import '#routes/book';
import HealthChecksController from '#controllers/health_checks_controller';
import env from '#start/env';

router
  .get('/health', [HealthChecksController])
  .use(({ request, response }: HttpContext, next: NextFn) => {
    if (request.header('x-monitoring-secret') === env.get('HEALTH_CHECK_API_KEY')) {
      return next();
    }
    response.unauthorized();
  });

router.get('/', async () => {
  return {
    message: 'ok',
  };
});
