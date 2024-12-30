import env from '#start/env';
import type { HttpContext } from '@adonisjs/core/http';
import type { NextFn } from '@adonisjs/core/types/http';

export default class ApiKeyRequiredMiddleware {
  public async handle({ request, response }: HttpContext, next: NextFn): Promise<void> {
    /**
     * Middleware logic goes here (before the next call)
     */
    const sentApiKey = request.header('api-key');

    if (sentApiKey !== env.get('CLIENT_API_KEY')) {
      return response.unauthorized();
    }
    return next();
  }
}